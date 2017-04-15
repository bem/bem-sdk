import test from 'ava';

import BemEntityName from '../index';

test('should provide `block` field', t => {
    const entityName = new BemEntityName({ block: 'block' });

    t.is(entityName.block, 'block');
});

test('should provide `elem` field', t => {
    const entityName = new BemEntityName({ block: 'block', elem: 'elem' });

    t.is(entityName.elem, 'elem');
});

test('should provide `mod` field', t => {
    const entityName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val' } });

    t.deepEqual(entityName.mod, { name: 'mod', val: 'val' });
});

test('should provide `modName` field', t => {
    const entityName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val' } });

    t.is(entityName.modName, 'mod');
});

test('should provide `modVal` field', t => {
    const entityName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val' } });

    t.is(entityName.modVal, 'val');
});

test('should return `undefined` if entity is not element', t => {
    const entityName = new BemEntityName({ block: 'block' });

    t.is(entityName.elem, undefined);
});

test('should return `undefined` if entity is not modifier', t => {
    const entityName = new BemEntityName({ block: 'block' });

    t.deepEqual(entityName.mod, undefined);
});

test('should return `undefined` in `modName` property if entity is not modifier', t => {
    const entityName = new BemEntityName({ block: 'block' });

    t.is(entityName.modName, undefined);
});

test('should return `undefined` in `modVal` property if entity is not modifier', t => {
    const entityName = new BemEntityName({ block: 'block' });

    t.is(entityName.modVal, undefined);
});
