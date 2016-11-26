'use strict';

/**
 * Enum for types of BEM entities.
 *
 * @readonly
 * @enum {String}
 */
const TYPES = {
    BLOCK:     'block',
    BLOCK_MOD: 'blockMod',
    ELEM:      'elem',
    ELEM_MOD:  'elemMod'
};

const presets = require('./lib/presets');

/**
 * It is necessary not to create new instances for the same custom naming.
 * @readonly
 */
const cache = {};

/**
 * Creates namespace with methods which allows getting information about BEM entity using string as well
 * as forming string representation based on naming object.
 *
 * @param {Object} [options]              Options.
 * @param {String} [options.elem=__]      Separates element's name from block.
 * @param {String|Object} [options.mod=_] Separates modifiers from blocks and elements.
 * @param {String} [options.mod.name=_]   Separates name of modifier from blocks and elements.
 * @param {String} [options.mod.val=_]    Separates value of modifier from name of modifier.
 * @param {String} [options.wordPattern]  Defines which symbols can be used for block, element and modifier's names.
 * @return {Object}
 */
function createNaming(options) {
    const opts = init(options);
    const id = JSON.stringify(opts);

    if (cache[id]) {
        return cache[id];
    }

    const delims = opts.delims;
    const regex = buildRegex(delims, opts.wordPattern);

    /**
     * Checks a string to be valid BEM notation.
     *
     * @param {String} str - String representation of BEM entity.
     * @returns {Boolean}
     */
    function validate(str) {
        return regex.test(str);
    }

    /**
     * Parses string into naming object.
     *
     * @param {String} str - string representation of BEM entity.
     * @returns {Object|undefined}
     */
    function parse(str) {
        const executed = regex.exec(str);

        if (!executed) { return undefined; }

        const notation = {
            block: executed[1] || executed[4]
        };
        const elem = executed[5];
        const modName = executed[2] || executed[6];

        elem && (notation.elem = elem);

        if (modName) {
            const modVal = executed[3] || executed[7];

            notation.modName = modName;
            notation.modVal = modVal || true;
        }

        return notation;
    }

    /**
     * Forms a string according to naming object.
     *
     * @param {Object} obj - naming object
     * @returns {String}
     */
    function stringify(obj) {
        if (!obj || !obj.block) {
            return undefined;
        }

        let res = obj.block;

        if (obj.elem) {
            res += delims.elem + obj.elem;
        }

        if (obj.modName) {
            const modVal = obj.modVal;

            if (modVal || modVal === 0 || !obj.hasOwnProperty('modVal')) {
                res += delims.mod.name + obj.modName;
            }

            if (modVal && modVal !== true) {
                res += delims.mod.val + modVal;
            }
        }

        return res;
    }

    /**
     * Returns a string indicating type of a BEM entity.
     *
     * @param {Object|String|undefined} obj - naming object or string representation of BEM entity.
     * @returns {String}
     */
    function typeOf(obj) {
        if (typeof obj === 'string') {
            obj = parse(obj);
        }

        if (!obj || !obj.block) { return undefined; }

        const modName = obj.modName;
        const isMod = modName && (obj.modVal || !obj.hasOwnProperty('modVal'));

        if (obj.elem) {
            if (isMod)    { return TYPES.ELEM_MOD; }
            if (!modName) { return TYPES.ELEM;     }
        }

        if (isMod)    { return TYPES.BLOCK_MOD; }
        if (!modName) { return TYPES.BLOCK;     }
    }

    /**
     * Checks whether naming object or string is a block.
     *
     * @param {Object|String} obj - naming object or string representation of BEM entity.
     * @returns {Boolean}
     */
    function isBlock(obj) {
        return typeOf(obj) === TYPES.BLOCK;
    }

    /**
     * Checks whether naming object or string is modifier of a block.
     *
     * @param {Object|String} obj - naming object or string representation of BEM entity.
     * @returns {Boolean}
     */
    function isBlockMod(obj) {
        return typeOf(obj) === TYPES.BLOCK_MOD;
    }

    /**
     * Checks whether naming object or string is element of a block.
     *
     * @param {Object|String} obj - naming object or string representation of BEM entity.
     * @returns {Boolean}
     */
    function isElem(obj) {
        return typeOf(obj) === TYPES.ELEM;
    }

    /**
     * Checks whether naming object or string is element of a block.
     *
     * @param {Object|String} obj - naming object or string representation of BEM entity.
     * @returns {Boolean}
     */
    function isElemMod(obj) {
        return typeOf(obj) === TYPES.ELEM_MOD;
    }

    const namespace = {
        validate: validate,
        typeOf: typeOf,
        isBlock: isBlock,
        isBlockMod: isBlockMod,
        isElem: isElem,
        isElemMod: isElemMod,
        parse: parse,
        stringify: stringify,
        /**
         * String to separate elem from block.
         *
         * @type {String}
         */
        elemDelim: delims.elem,
        /**
         * String to separate modifiers from blocks and elements.
         *
         * @type {String}
         */
        modDelim: delims.mod.name,
        /**
         * String to separate value of modifier from name of modifier.
         *
         * @type {String}
         */
        modValDelim: delims.mod.val
    };

    cache[id] = namespace;

    return namespace;
}

/**
 * Returns delims and wordPattern.
 *
 * @param {Object} options - user options
 * @returns {{delims: Object, wordPattern: String}}
 */
function init(options) {
    if (!options) {
        return presets.origin;
    }

    if (typeof options === 'string') {
        const preset = presets[options];

        if (!preset) {
            throw new Error('The `' + options + '` naming is unknown.');
        }

        return preset;
    }

    const defaults = presets.origin;
    const defaultDelims = defaults.delims;
    const defaultModDelims = defaultDelims.mod;
    const mod = options.mod || defaultDelims.mod;

    return {
        delims: {
            elem: options.elem || defaultDelims.elem,
            mod: typeof mod === 'string'
                ? { name: mod, val: mod }
                : {
                    name: mod.name || defaultModDelims.name,
                    val: mod.val || mod.name || defaultModDelims.val
                }
        },
        wordPattern: options.wordPattern || defaults.wordPattern
    };
}

/**
 * Builds regex for specified naming.
 *
 * @param {Object} delims      Separates block names, elements and modifiers.
 * @param {String} wordPattern Defines which symbols can be used for block, element and modifier's names.
 * @returns {RegExp}
 */
function buildRegex(delims, wordPattern) {
    const block = '(' + wordPattern + ')';
    const elem = '(?:' + delims.elem + '(' + wordPattern + '))?';
    const modName = '(?:' + delims.mod.name + '(' + wordPattern + '))?';
    const modVal = '(?:' + delims.mod.val + '(' + wordPattern + '))?';
    const mod = modName + modVal;

    return new RegExp('^' + block + mod + '$|^' + block + elem + mod + '$');
}

const api = [
    'validate', 'typeOf',
    'isBlock', 'isBlockMod', 'isElem', 'isElemMod',
    'parse', 'stringify',
    'elemDelim', 'modDelim', 'modValDelim'
];
const originalNaming = createNaming();

api.forEach(function (name) {
    createNaming[name] = originalNaming[name];
});

module.exports = createNaming;
