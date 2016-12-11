'use strict';

/**
 * Intersecting sets of cells.
 *
 * @param {BemCell[]} set - Original set of cells.
 * @param {...(BemCell[])} otherSet - Set (or sets) of that should be merged into the original one.
 * @returns {BemCell[]} - Resulting set of cells.
 */
module.exports = function () {
    const hash = {};
    const res = [];
    const setsQty = arguments.length;

    for (let i = 0, l = setsQty; i < l; ++i) {
        const set = arguments[i];

        for (let j = 0, dl = set.length; j < dl; ++j) {
            const cell = set[j];

            hash[cell.id] || (hash[cell.id] = 0);

            // Mark entity
            hash[cell.id] += 1;

            // If entity exists in each set
            if (hash[cell.id] === setsQty) {
                res.push(cell);
            }
        }
    }

    return res;
};
