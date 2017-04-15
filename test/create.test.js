import test from 'ava';

import BemEntityName from '../index';

test('should return object as is if it`s a BemEntityName', t => {
    const entityName = new BemEntityName({ block: 'block' });

    t.is(BemEntityName.create(entityName), entityName);
});

test('should create block from object', t => {
    const entityName = BemEntityName.create({ block: 'block' });

    t.pass(entityName instanceof BemEntityName, 'Should be an instance of BemEntityName');
    t.deepEqual(entityName.valueOf(), { block: 'block' }, 'Should contain a name for same entity');
});

test('should create block by a string', t => {
    const entityName = BemEntityName.create('block');

    t.deepEqual(entityName.valueOf(), { block: 'block' });
});

test('should create element from object', t => {
    const entityName = BemEntityName.create({ block: 'block', elem: 'elem' });

    t.deepEqual(entityName.valueOf(), { block: 'block', elem: 'elem' });
});

test('should create simple modifier of block from object', t => {
    const entityName = BemEntityName.create({ block: 'block', mod: 'mod' });

    t.deepEqual(entityName.valueOf(), { block: 'block', mod: { name: 'mod', val: true } });
});

test('should create modifier of block from object', t => {
    const entityName = BemEntityName.create({ block: 'block', mod: 'mod', val: 'val' });

    t.deepEqual(entityName.valueOf(), { block: 'block', mod: { name: 'mod', val: 'val' } });
});

test('should normalize boolean modifier', t => {
    const entityName = BemEntityName.create({ block: 'block', mod: { name: 'mod' } });

    t.true(entityName.mod.val);
});

test('should save normalized boolean modifier', t => {
    const entityName = BemEntityName.create({ block: 'block', mod: { name: 'mod' } });

    t.true(entityName.mod.val);
});

test('should support `modName` and `modVal` fields', t => {
    const entityName = BemEntityName.create({ block: 'block', modName: 'mod', modVal: 'val' });

    t.deepEqual(entityName.mod, { name: 'mod', val: 'val' });
});

test('should support `modName` field only', t => {
    const entityName = BemEntityName.create({ block: 'block', modName: 'mod' });

    t.deepEqual(entityName.mod, { name: 'mod', val: true });
});

test('should use `mod.name` field instead of `modName`', t => {
    const entityName = BemEntityName.create({ block: 'block', mod: { name: 'mod1' }, modName: 'mod2' });

    t.is(entityName.mod.name, 'mod1');
});

test('should use `mod.val` field instead of `modVal`', t => {
    const entityName = BemEntityName.create({ block: 'block', mod: { name: 'm', val: 'v1' }, modVal: 'v2' });

    t.is(entityName.mod.val, 'v1');
});

test('should use `mod.name` and `mod.val` instead of `val`', t => {
    const entityName = BemEntityName.create({ block: 'block', mod: { name: 'm', val: 'v1' }, val: 'v3'});

    t.is(entityName.mod.val, 'v1');
});

test('should use `mod.name` and `mod.val` instead of `modVal` and `val`', t => {
    const entityName = BemEntityName.create({ block: 'block', mod: { name: 'm', val: 'v1' }, modVal: 'v2', val: 'v3'});

    t.is(entityName.mod.val, 'v1');
});
