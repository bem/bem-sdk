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
    assert(data.hasOwnProperty('deps') || data.hasOwnProperty('decl'), 'Invalid format of enb declaration.');

    return normalize(data.deps || data.decl);
};
