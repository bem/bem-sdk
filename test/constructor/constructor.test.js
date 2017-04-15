import test from 'ava';

import BemEntityName from '../../index';

test('should create block', t => {
    const data = { block: 'block' };

    t.deepEqual((new BemEntityName(data)).valueOf(), data);
});

test('should create modifier of block', t => {
    const data = { block: 'block', mod: { name: 'mod', val: 'val' } };

    t.deepEqual((new BemEntityName(data)).valueOf(), data);
});

test('should create element', t => {
    const data = { block: 'block', elem: 'elem' };

    t.deepEqual((new BemEntityName(data)).valueOf(), data);
});

test('should create modifier of element', t => {
    const data = { block: 'block', elem: 'elem', mod: { name: 'mod', val: 'val' } };

    t.deepEqual((new BemEntityName(data)).valueOf(), data);
});
