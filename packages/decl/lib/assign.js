'use strict';

const assert = require('assert');

const BemEntityName = require('@bem/entity-name');
const BemCell = require('@bem/cell');

const isValidVal = v => Boolean(v || v === 0);

const cellify = data => {
    data.entity = new BemEntityName(data.entity);
    return new BemCell(data);
};

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
        return cellify(result);
    }

    if (fEntity.block) {
        Object.assign(result.entity, fEntity);
        return cellify(result);
    }

    result.entity.block = fEntity.block || sEntity.block;

    if (fEntity.elem) {
        result.entity.elem = fEntity.elem;
        if (!fEntity.modName) {
            return cellify(result);
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

    return cellify(result);
};
