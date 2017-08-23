'use strict';

const assert = require('assert');

const BemCell = require('@bem/sdk.cell');

const isValidVal = v => Boolean(v || v === 0);

/**
 * Fills entity fields with the scope ones.
 *
 * @param {{entity: {block: ?string, elem: [string], modName: ?string, modVal: string}, tech: ?string}} file -
 *   Incoming entity and tech
 * @param {BemCell} scope - Context, the processing entity usually
 * @returns {BemCell} - Filled entity and tech
 */
module.exports = function (file, scope) {
    assert(scope, 'Scope parameter is a required one.')
    assert(scope.constructor.name === 'BemCell' || scope.entity && scope.entity.block,
        'Scope parameter should be a BemCell-like object.');

    const fEntity = file.entity || {};
    const sEntity = scope.entity;
    const result = {
        entity: {},
        tech: file.tech || scope.tech || null
    };

    const fKeysLength = Object.keys(file).length;
    if (fKeysLength === 0 || fKeysLength === 1 && file.tech) {
        result.entity = sEntity;
        return BemCell.create(result);
    }

    if (fEntity.block) {
        Object.assign(result.entity, fEntity.valueOf());
        return BemCell.create(result);
    }

    result.entity.block = fEntity.block || sEntity.block;

    if (fEntity.elem) {
        result.entity.elem = fEntity.elem;
        if (!fEntity.modName) {
            return BemCell.create(result);
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

    return BemCell.create(result);
};
