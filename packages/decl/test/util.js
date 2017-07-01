'use strict';

const BemCell = require('@bem/cell');
const BemEntityName = require('@bem/entity-name');

exports.createCell = (cell) => new BemCell({
    entity: new BemEntityName(cell.entity),
    tech: cell.tech
});

exports.simplifyCell = function (cell) {
    const entity = { block: cell.entity.block };
    cell.entity.elem && (entity.elem = cell.entity.elem);
    if (cell.entity.mod) {
        entity.modName = cell.entity.mod.name;
        entity.modVal = cell.entity.mod.val;
    }

    return {
        entity: entity,
        tech: cell.tech || null
    };
};
