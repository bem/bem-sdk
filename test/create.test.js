const test = require('ava');

const BemEntityName = require('../index');

test('should return object as is if it`s a BemEntityName', t => {
    const entity = new BemEntityName({ block: 'b' });

    t.is(BemEntityName.create(entity), entity);
});

test('should create BemEntityName for block from obj', t => {
    const entity = BemEntityName.create({ block: 'b' });

    t.pass(entity instanceof BemEntityName, 'Should be an instance of BemEntityName');
    t.deepEqual(entity.valueOf(), { block: 'b' }, 'Should contain a name for same entity');
});

test('should create entity for elem from obj', t => {
    const entity = BemEntityName.create({ block: 'b', elem: 'e' });

    t.deepEqual(entity.valueOf(), { block: 'b', elem: 'e' });
});

test('should create entity from obj with deps mods without value', t => {
    const entity = BemEntityName.create({ block: 'b', mod: 'm' });

    t.deepEqual(entity.valueOf(), { block: 'b', mod: { name: 'm', val: true } });
});

test('should create entity from obj with deps mods', t => {
    const entity = BemEntityName.create({ block: 'b', mod: 'm', val: 'v' });

    t.deepEqual(entity.valueOf(), { block: 'b', mod: { name: 'm', val: 'v' } });
});

test('should normalize boolean modifier', t => {
    const entity = BemEntityName.create({ block: 'block', mod: { name: 'mod' } });

    t.true(entity.mod.val);
});

test('should normalize short entry for boolean modifier', t => {
    const entity = BemEntityName.create({ block: 'block', mod: 'mod' });

    t.true(entity.mod.val);
});

test('should support `modName` and `modVal` fields', t => {
    const entity = BemEntityName.create({ block: 'block', modName: 'mod', modVal: 'val' });

    t.deepEqual(entity.mod, { name: 'mod', val: 'val' });
});

test('should support `modName` field only', t => {
    const entity = BemEntityName.create({ block: 'block', modName: 'mod' });

    t.deepEqual(entity.mod, { name: 'mod', val: true });
});

test('should use `mod.name` field instead of `modName`', t => {
    const entity = BemEntityName.create({ block: 'block', mod: { name: 'mod1' }, modName: 'mod2' });

    t.is(entity.mod.name, 'mod1');
});

test('should use `mod.val` field instead of `modVal`', t => {
    const entity = BemEntityName.create({ block: 'block', mod: { name: 'm', val: 'v1' }, modVal: 'v2' });

    t.is(entity.mod.val, 'v1');
});

test('should use `mod.name` and `mod.val` instead of `val`', t => {
    const entity = BemEntityName.create({ block: 'block', mod: { name: 'm', val: 'v1' }, val: 'v3'});

    t.is(entity.mod.val, 'v1');
});

test('should use `mod.name` and `mod.val` instead of `modVal` and `val`', t => {
    const entity = BemEntityName.create({ block: 'block', mod: { name: 'm', val: 'v1' }, modVal: 'v2', val: 'v3'});

    t.is(entity.mod.val, 'v1');
});
