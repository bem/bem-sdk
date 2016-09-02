'use strict';

const isValidVal = v => Boolean(v || v === 0);

/**
 * Fills entity fields with the scope ones.
 *
 * @param {BemFile} file - incoming entity and tech
 * @param {BemFile} scope - context, the processing entity usually
 * @returns {BemFile} - Filled entity and tech
 */
module.exports = function (file, scope) {
    const fEntity = file.entity || {};
    const sEntity = scope.entity || {};
    const result = {
        entity: {},
        tech: file.tech || scope.tech || null
    };

    if (Object.keys(file).length === 0 || Object.keys(file).length === 1 && file.tech) {
        Object.assign(result.entity, sEntity);
        return result;
    }

    if (!fEntity.block && !sEntity.block) {
        return result;
    }

    if (fEntity.block) {
        Object.assign(result.entity, fEntity);
        return result;
    }

    result.entity.block = fEntity.block || sEntity.block;

    if (fEntity.elem) {
        result.entity.elem = fEntity.elem;
        if (!fEntity.modName) {
            return result;
        }
    } else if (sEntity.elem && ((fEntity.modName || fEntity.modVal) || fEntity.block == null)) {
        result.entity.elem = sEntity.elem;
    }

    if (fEntity.modName) {
        result.entity.modName = fEntity.modName;
        isValidVal(fEntity.modVal) && (result.entity.modVal = fEntity.modVal);
    } else if (sEntity.modName && (isValidVal(fEntity.modVal) || isValidVal(sEntity.modVal))) {
        result.entity.modName = sEntity.modName;
        result.entity.modVal = isValidVal(fEntity.modVal) ? fEntity.modVal : sEntity.modVal;
    }

    return result;
};
