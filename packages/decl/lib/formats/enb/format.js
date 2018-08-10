'use strict';

/**
 * Format normalized declaration to enb format.
 *
 * @param {BemCell[]} cells - Source declaration
 * @returns {Array<{block: string, elem: ?string, mod: ?{name: string, val: (string|true)}, tech: ?string}>}
 */
module.exports = function (cells) {
    Array.isArray(cells) || (cells = [cells]);

    const decl = cells.map(cell => {
        const entity = cell.entity;
        const tmp = { block: entity.block };
        entity.elem && (tmp.elem = entity.elem);

        if (entity.mod) {
            tmp.mod = entity.mod.name;

            entity.mod.val !== true && (tmp.val = entity.mod.val);
        }

        cell.tech && (tmp.tech = cell.tech);

        return tmp;
    });

    return {
        format: 'enb',
        deps: decl
    };
};
