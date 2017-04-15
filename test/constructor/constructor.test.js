import test from 'ava';

import BemEntityName from '../../lib/entity-name';

test('should create block', t => {
    const obj = { block: 'block' };
    const entityName = new BemEntityName(obj);

    t.deepEqual((entityName).valueOf(), obj);
});

test('should create modifier of block', t => {
    const obj = { block: 'block', mod: { name: 'mod', val: 'val' } };
    const entityName = new BemEntityName(obj);

    t.deepEqual((entityName).valueOf(), obj);
});

test('should create element', t => {
    const obj = { block: 'block', elem: 'elem' };
    const entityName = new BemEntityName(obj);

    t.deepEqual((entityName).valueOf(), obj);
});

test('should create modifier of element', t => {
    const obj = { block: 'block', elem: 'elem', mod: { name: 'mod', val: 'val' } };
    const entityName = new BemEntityName(obj);

    t.deepEqual((entityName).valueOf(), obj);
});
