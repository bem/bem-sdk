'use strict';

const presets = require('./lib/presets');
const BemEntityName = require('@bem/entity-name');

/**
 * It is necessary not to create new instances for the same custom naming.
 * @readonly
 */
const cache = {};

/**
 * Delims of bem entity, elem and/or mod.
 *
 * @typedef {Object} Delims
 * @param {String} [elem='__']      Separates element's name from block.
 * @param {String|Object} [mod='_'] Separates modifiers from blocks and elements.
 * @param {String} [mod.name='_']   Separates name of modifier from blocks and elements.
 * @param {String} [mod.val='_']    Separates value of modifier from name of modifier.
 */

/**
 * Creates namespace with methods which allows getting information about BEM entity using string as well
 * as forming string representation based on naming object.
 *
 * @param {Object} [options]              Options.
 * @param {Delims} [options.delims]       Defines delims for bem entity.
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
     * Parses string into naming object.
     *
     * @param {String} str - string representation of BEM entity.
     * @returns {Object|undefined}
     */
    function parse(str) {
        const executed = regex.exec(str);

        if (!executed) { return undefined; }

        const modName = executed[2] || executed[6];

        return new BemEntityName({
            block: executed[1] || executed[4],
            elem: executed[5],
            mod: modName && {
                name: modName,
                val: executed[3] || executed[7] || true
            }
        });
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

        const modObj = obj.mod;
        const modName = (typeof modObj === 'string' ? modObj : modObj && modObj.name) || obj.modName;

        if (modName) {
            const hasModVal = modObj && modObj.hasOwnProperty('val') || obj.hasOwnProperty('modVal');
            const modVal = modObj && modObj.val || obj.modVal;

            if (modVal || modVal === 0 || !hasModVal) {
                res += delims.mod.name + modName;
            }

            if (modVal && modVal !== true) {
                res += delims.mod.val + modVal;
            }
        }

        return res;
    }

    const namespace = {
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
 * @returns {{delims: Delims, wordPattern: String}}
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
    const optionsDelims = options.delims || {};
    const mod = optionsDelims.mod || defaultDelims.mod;

    return {
        delims: {
            elem: optionsDelims.elem || defaultDelims.elem,
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
 * @param {Delims} delims      Separates block names, elements and modifiers.
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
    'parse', 'stringify',
    'elemDelim', 'modDelim', 'modValDelim'
];
const originalNaming = createNaming();

api.forEach(function (name) {
    createNaming[name] = originalNaming[name];
});

module.exports = createNaming;
