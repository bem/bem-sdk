'use strict';

const test = require('ava');

const BemEntityName = require('@bem/entity-name');

const BemCell = require('../index');

const cell = new BemCell({ entity: new BemEntityName({ block: 'b', elem: 'e', mod: { name: 'm', val: 'v' } }) });
const modLessCell = new BemCell({ entity: new BemEntityName({ block: 'b' }) });

test('should return block field from entity', t => {
    t.is(cell.block, cell.entity.block);
});

test('should return elem field from entity', t => {
    t.is(cell.elem, cell.entity.elem);
});

test('should return modName field from entity', t => {
    t.is(cell.modName, cell.entity.modName);
});

test('should return modVal field from entity', t => {
    t.is(cell.modVal, cell.entity.modVal);
});

test('should return mod field from entity', t => {
    t.deepEqual(cell.mod, cell.entity.mod);
});

test('should return undefined for modName field from entity', t => {
    t.is(modLessCell.modName, undefined);
});

test('should return undefined for modVal field from entity', t => {
    t.is(modLessCell.modVal, undefined);
});

test('should return undefined for mod field from entity', t => {
    t.is(modLessCell.mod, undefined);
});
