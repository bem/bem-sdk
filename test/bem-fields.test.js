import test from 'ava';

import BemEntityName from '../index';

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

test('should return `undefined` if entity is not element', t => {
    const entity = new BemEntityName({ block: 'block' });

    t.is(entity.elem, undefined);
});

test('should return `undefined` if entity is not modifier', t => {
    const entity = new BemEntityName({ block: 'block' });

    t.deepEqual(entity.mod, undefined);
});

test('should return `undefined` in `modName` property if entity is not modifier', t => {
    const entity = new BemEntityName({ block: 'block' });

    t.is(entity.modName, undefined);
});

test('should return `undefined` in `modVal` property if entity is not modifier', t => {
    const entity = new BemEntityName({ block: 'block' });

    t.is(entity.modVal, undefined);
});
