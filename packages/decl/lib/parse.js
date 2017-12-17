'use strict';

const assert = require('assert');

const nodeEval = require('node-eval');

const formats = require('./formats');
const detect = require('./detect');

/**
 * Parses BEMDECL file data
 *
 * @param {String|Object} bemdecl - string of bemdecl or object
 * @returns {Array<BemEntity>}      Array of normalized entities
 */
module.exports = function parse(bemdecl) {
    assert(typeof bemdecl === 'object' || typeof bemdecl === 'string', 'Bemdecl must be String or Object');

    const data = (typeof bemdecl === 'string') ? nodeEval(bemdecl) : bemdecl;
    const formatName = data.format || detect(data);
    const format = formats[formatName];

    if (!format) {
        throw new Error('Unknown BEMDECL format.');
    }

    return format.parse(data);
};
