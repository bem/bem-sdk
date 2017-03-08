'use strict';

/**
 * Delims of bem entity, elem and/or mod.
 *
 * @typedef {Object} BemNamingDelims
 * @param {String} [elem='__'] — separates element's name from block.
 * @param {String|Object} [mod='_'] — separates modifiers from blocks and elements.
 * @param {String} [mod.name='_'] — separates name of modifier from blocks and elements.
 * @param {String} [mod.val='_'] — separates value of modifier from name of modifier.
 */

 /**
  * BEM naming convention options.
  *
  * @typedef {Object} BemNamingConvention
  * @param {BemNamingDelims} delims — separates entity names from each other.
  * @param {String|Object} [wordPattern='[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*'] — defines which symbols can be used for block,
  *                                                                         element and modifier's names.
  */

const createStringify = require('./lib/create-stringify');
const createParse = require('./lib/create-parse');
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
 * @param {BemNamingConvention} [options] - options for naming convention.
 * @return {Object}
 */
function createNaming(options) {
    const opts = init(options);
    const id = JSON.stringify(opts);

    if (cache[id]) {
        return cache[id];
    }

    const delims = opts.delims;
    const namespace = {
        parse: createParse(opts),
        stringify: createStringify(opts),
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
 * @returns {BemNamingDelims}
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
                    val: mod.val || defaultModDelims.val
                }
        },
        wordPattern: options.wordPattern || defaults.wordPattern
    };
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
