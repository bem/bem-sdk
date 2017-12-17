'use strict';

const assert = require('assert');

const normalize = require('./normalize');

/**
 * Parses enb declaration.
 *
 * @param {Object} data - Object with declaration
 * @returns {BemCell[]}
 */
module.exports = (data) => {
    assert(data.hasOwnProperty('blocks'), 'Invalid format of v1 declaration.');

    return normalize(data.blocks);
};
