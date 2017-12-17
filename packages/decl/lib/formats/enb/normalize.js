'use strict';

const BemEntityName = require('@bem/sdk.entity-name');
const BemCell = require('@bem/sdk.cell');

/**
 * Normalizes enb declaration.
 *
 * @param {Array<{block: string, elem: ?string, mod: ?{name: string, val: (string|true)}, tech: ?string}>} items - declaration
 * @returns {BemCell[]}
 */
module.exports = function (items) {
    return items.map(item => {
        const entityObj = { block: item.block };

        item.elem && (entityObj.elem = item.elem);

        if (item.mod) {
            entityObj.mod = { name: item.mod }
            item.val && (entityObj.mod.val = item.val);
        }

        return new BemCell({
            entity: new BemEntityName(entityObj),
            tech: item.tech
        });
    });
};
