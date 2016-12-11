'use strict';

/**
 * Merging sets of cells.
 *
 * @param {BemCell[]} collection - Original set of cells.
 * @param {...(BemCell[])} otherCollection - Set (or sets) of that should be merged into the original one.
 * @returns {BemCell[]} - Resulting set of cells.
 */
module.exports = function (collection) {
    const hash = {};
    const res = [].concat(collection);

    // Build index on the first declaration
    for (let i = 0, l = res.length; i < l; ++i) {
        hash[res[i].id] = true;
    }

    // Merge the first declaration with other
    for (let i = 1, l = arguments.length; i < l; ++i) {
        const current = arguments[i];

        for (let j = 0, cl = current.length; j < cl; ++j) {
            const cell = current[j];

            if (hash[cell.id]) {
                continue;
            }

            res.push(cell);
            hash[cell.id] = true;
        }
    }

    return res;
};
