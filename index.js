'use strict';

(function (global) {
/**
 * Enum for types of BEM entities.
 *
 * @readonly
 * @enum {String}
 */
var TYPES = {
    BLOCK:     'block',
    BLOCK_MOD: 'blockMod',
    ELEM:      'elem',
    ELEM_MOD:  'elemMod'
};

/**
 * Defines which symbols can be used for block, element and modifier's names.
 * @readonly
 */
var WORD_PATTERN = '[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*';

/**
 * Presets of options for various naming.
 * @readonly
 */
var presets = {
    origin: {
        delims: {
            elem: '__',
            mod: { name: '_', val: '_' }
        },
        wordPattern: WORD_PATTERN
    },
    'two-dashes': {
        delims: {
            elem: '__',
            mod: { name: '--', val: '_' }
        },
        wordPattern: WORD_PATTERN
    }
};

/**
 * It is necessary not to create new instances for the same custom naming.
 * @readonly
 */
var cache = {};

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
    var opts = init(options),
        id = JSON.stringify(opts);

    if (cache[id]) {
        return cache[id];
    }

    var delims = opts.delims,
        regex = buildRegex(delims, opts.wordPattern);

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
        var executed = regex.exec(str);

        if (!executed) { return undefined; }

        var notation = {
                block: executed[1] || executed[4]
            },
            elem = executed[5],
            modName = executed[2] || executed[6];

        elem && (notation.elem = elem);

        if (modName) {
            var modVal = executed[3] || executed[7];

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

        var res = obj.block;

        if (obj.elem) {
            res += delims.elem + obj.elem;
        }

        if (obj.modName) {
            var modVal = obj.modVal;

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

        var modName = obj.modName,
            isMod = modName && (obj.modVal || !obj.hasOwnProperty('modVal'));

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

    var namespace = {
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
    options || (options = {});

    if (typeof options === 'string') {
        var preset = presets[options];

        if (!preset) {
            throw new Error('The `' + options + '` naming is unknown.');
        }

        return preset;
    }

    var defaults = presets.origin,
        defaultDelims = defaults.delims,
        defaultModDelims = defaultDelims.mod,
        mod = options.mod || defaultDelims.mod;

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
    var block = '(' + wordPattern + ')',
        elem = '(?:' + delims.elem + '(' + wordPattern + '))?',
        modName = '(?:' + delims.mod.name + '(' + wordPattern + '))?',
        modVal = '(?:' + delims.mod.val + '(' + wordPattern + '))?',
        mod = modName + modVal;

    return new RegExp('^' + block + mod + '$|^' + block + elem + mod + '$');
}

var defineAsGlobal = true,
    api = [
        'validate', 'typeOf',
        'isBlock', 'isBlockMod', 'isElem', 'isElemMod',
        'parse', 'stringify',
        'elemDelim', 'modDelim', 'modValDelim'
    ],
    originalNaming = createNaming();

api.forEach(function (name) {
    createNaming[name] = originalNaming[name];
});

// Node.js
/* istanbul ignore if */
if (typeof exports === 'object') {
    module.exports = createNaming;
    defineAsGlobal = false;
}

// YModules
/* istanbul ignore if */
if (typeof modules === 'object') {
    modules.define('bem-naming', function (provide) {
        provide(createNaming);
    });
    defineAsGlobal = false;
}

// AMD
/* istanbul ignore if */
if (typeof define === 'function') {
    define(function (require, exports, module) {
        module.exports = createNaming;
    });
    defineAsGlobal = false;
}

/* istanbul ignore next */
defineAsGlobal && (global.bemNaming = createNaming);
})(typeof window !== 'undefined' ? window : global);
