'use strict';

/**
 * Delims of bem entity, elem and/or mod.
 *
 * @typedef {Object} INamingConventionDelims
 * @param {String} [elem='__'] — separates element's name from block.
 * @param {String|Object} [mod='_'] — separates modifiers from blocks and elements.
 * @param {String} [mod.name='_'] — separates name of modifier from blocks and elements.
 * @param {String} [mod.val='_'] — separates value of modifier from name of modifier.
 */

 /**
  * BEM naming convention options.
  *
  * @typedef {Object} INamingConvention
  * @param {INamingConventionDelims} delims — separates entity names from each other.
  * @param {String|Object} [wordPattern='[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*'] — defines which symbols can be used for block,
  *                                                                         element and modifier's names.
  */

const createStringify = require('@bem/sdk.naming.entity.stringify');
const createParse = require('@bem/sdk.naming.entity.parse');
const createPreset = require('@bem/sdk.naming.presets/create');

/**
 * It is necessary not to create new instances for the same custom naming.
 * @readonly
 */
const cache = {};

/**
 * Creates namespace with methods which allows getting information about BEM entity using string as well
 * as forming string representation based on naming object.
 *
 * @param {INamingConvention} [options] - options for naming convention.
 * @return {Object}
 */
function createNaming(options) {
    const opts = createPreset(options);
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
        delims
    };

    cache[id] = namespace;

    return namespace;
}

module.exports = Object.assign(createNaming, createNaming());
