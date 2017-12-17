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
    assert(data.hasOwnProperty('decl'), 'Invalid format of harmony declaration.');

    return normalize(data.decl);
};
