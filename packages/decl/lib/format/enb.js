'use strict';

/**
 * Format normalized declaration to enb format
 *
 * @param {Array<BemCell>|BemCell} decl - Source declaration
 * @returns {Array<{block: string, elem: ?string, mod: ?{name: string, val: (string|true)}, tech: ?string}>}
 */
module.exports = function (decl) {
    Array.isArray(decl) || (decl = [decl]);

    return decl.map(cell => {
        const entity = cell.entity;
        const tmp = { block: entity.block };
        entity.elem && (tmp.elem = entity.elem);

        if (entity.mod) {
            tmp.mod = entity.mod.name;
            tmp.val = entity.mod.val;
        }

        cell.tech && (tmp.tech = cell.tech);

        return tmp;
    });
};
