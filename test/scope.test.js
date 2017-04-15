import test from 'ava';

import BemEntityName from '../lib/entity-name';

test('should return scope of block', t => {
    const entityName = new BemEntityName({ block: 'block' });

    t.is(entityName.scope, null);
});

test('should return scope of block modifier', t => {
    const entityName = new BemEntityName({ block: 'block', mod: 'mod' });

    t.deepEqual(entityName.scope.valueOf(), { block: 'block' });
});

test('should return same scope for simple and complex mod', t => {
    const simpleModName = new BemEntityName({ block: 'block', mod: 'mod' });
    const complexModName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val' } });

    t.deepEqual(simpleModName.scope, complexModName.scope);
});

test('should return scope of element', t => {
    const entityName = new BemEntityName({ block: 'block', elem: 'elem' });

    t.deepEqual(entityName.scope.valueOf(), { block: 'block' });
});

test('should return scope of element modifier', t => {
    const entityName = new BemEntityName({ block: 'block', elem: 'elem', mod: 'mod' });

    t.deepEqual(entityName.scope.valueOf(), { block: 'block', elem: 'elem' });
});

test('should cache scope value', t => {
    const entity = new BemEntityName({ block: 'block', elem: 'elem' });

    entity.scope; // eslint-disable-line no-unused-expressions

    t.deepEqual(entity._scope.valueOf(), { block: 'block' });
});

test('should get scope from cache', t => {
    const entity = new BemEntityName({ block: 'block', elem: 'elem' });

    entity._scope = 'fake';

    t.is(entity.scope, 'fake');
});
