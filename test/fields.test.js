const test = require('ava');

const BemEntityName = require('../index');

test('should provide `block` field', t => {
    const entity = new BemEntityName({ block: 'block' });

    t.is(entity.block, 'block');
});

test('should provide `elem` field', t => {
    const entity = new BemEntityName({ block: 'block', elem: 'elem' });

    t.is(entity.elem, 'elem');
});

test('should provide `mod` field', t => {
    const entity = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val' } });

    t.deepEqual(entity.mod, { name: 'mod', val: 'val' });
});

test('should provide `modName` field', t => {
    const entity = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val' } });

    t.is(entity.modName, 'mod');
});

test('should provide `modVal` field', t => {
    const entity = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val' } });

    t.is(entity.modVal, 'val');
});
