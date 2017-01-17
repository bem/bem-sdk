'use strict';

const merge = require('./merge');

/**
 * Subtracting sets of cells.
 *
 * @param {BemCell[]} collection - Original set
 * @param {...(BemCell[])} removingSet - Set (or sets) with cells that should be removed
 * @returns {BemCell[]} - Resulting set of cells
 */
module.exports = function (collection, removingSet) {
    const hash = {};
    (arguments.length > 2) && (removingSet = merge.apply(null, [].slice.call(arguments, 1)));

    // Build index on what declaration
    for (let i = 0, l = removingSet.length; i < l; ++i) {
        hash[removingSet[i].id] = true;
    }

    return collection.filter(function (item) {
        return !hash[item.id];
    });
};
