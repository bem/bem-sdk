'use strict';

const assert = require('assert');

const BemCell = require('@bem/sdk.cell');

const isValidVal = v => Boolean(v || v === 0);

/**
 * Fills entity fields with the scope ones.
 *
 * @param {{entity: {block: ?string, elem: [string], mod: ?{name: string, val: (string|true)}}, tech: ?string}} cell -
 *   Incoming entity and tech
 * @param {BemCell} scope - Context, the processing entity usually
 * @returns {BemCell} - Filled entity and tech
 */
module.exports = function (cell, scope) {
    assert(scope, 'Scope parameter is a required one.');
    assert(scope.constructor.name === 'BemCell' || scope.entity && scope.entity.block,
        'Scope parameter should be a BemCell-like object.');

    const fEntity = cell.entity || {};
    const sEntity = scope.entity;
    const result = {
        entity: {},
        tech: cell.tech || scope.tech || null
    };

    const fKeysLength = Object.keys(cell).length;
    if (fKeysLength === 0 || fKeysLength === 1 && cell.tech) {
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
        if (!fEntity.mod) {
            return BemCell.create(result);
        }
    } else if (sEntity.elem && (fEntity.mod && (fEntity.mod.name || fEntity.mod.val) || fEntity.block == null)) {
        result.entity.elem = sEntity.elem;
    }

    if (fEntity.mod && fEntity.mod.name) {
        result.entity.mod = { name: fEntity.mod.name, val: true };
        isValidVal(fEntity.mod.val) && (result.entity.mod.val = fEntity.mod.val);
    } else if (sEntity.mod) {
        result.entity.mod = { name: sEntity.mod.name, val: true };
        result.entity.mod.val = fEntity.mod && isValidVal(fEntity.mod.val) ? fEntity.mod.val : sEntity.mod.val;
    }

    return BemCell.create(result);
};
