import BemCell from '@bem/sdk.cell';

export const createCell = BemCell.create;

export const simplifyCell = function (cell) {
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
