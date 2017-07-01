import test from 'ava';

import BemEntityName from '../../lib/entity-name';

test('should normalize simple modifier', t => {
    const entity = new BemEntityName({ block: 'block', mod: 'mod' });

    t.true(entity.mod.val);
});

test('should normalize boolean modifier', t => {
    const entity = new BemEntityName({ block: 'block', mod: { name: 'mod' } });

    t.true(entity.mod.val);
});

test('should save normalized boolean modifier', t => {
    const entity = new BemEntityName({ block: 'block', mod: { name: 'mod', val: true } });

    t.true(entity.mod.val);
});

test('should support `modName` and `modVal` fields', t => {
    const entity = new BemEntityName({ block: 'block', modName: 'mod', modVal: 'val' });

    t.deepEqual(entity.mod, { name: 'mod', val: 'val' });
});

test('should support `modName` field only', t => {
    const entity = new BemEntityName({ block: 'block', modName: 'mod' });

    t.deepEqual(entity.mod, { name: 'mod', val: true });
});

test('should use `mod.name` field instead of `modName`', t => {
    const entity = new BemEntityName({ block: 'block', mod: { name: 'mod1' }, modName: 'mod2' });

    t.is(entity.mod.name, 'mod1');
});

test('should use `mod.val` field instead of `modVal`', t => {
    const entity = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val1' }, modVal: 'val2' });

    t.is(entity.mod.val, 'val1');
});

test('should return the same instance for same class', t => {
    const entity = new BemEntityName({ block: 'block', mod: 'mod' });
    const entity2 = new BemEntityName(entity);

    t.is(entity, entity2);
});

test('should not use modName field for BemEntityName instances of another versions', t => {
    const entity = new BemEntityName({ block: 'block', modName: 'mod', __isBemEntityName__: true });

    t.is(entity.mod, undefined);
});
