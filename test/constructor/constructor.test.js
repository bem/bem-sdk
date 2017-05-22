import test from 'ava';

import BemjsonNode from '../..';

test('should create block', t => {
    const obj = { block: 'block', mods: {} };
    const bemjsonNode = new BemjsonNode(obj);

    t.deepEqual(bemjsonNode.valueOf(), obj);
});

test('should create modifier of block', t => {
    const obj = { block: 'block', mods: { mod: 'val' } };
    const bemjsonNode = new BemjsonNode(obj);

    t.deepEqual(bemjsonNode.valueOf(), obj);
});

test('should create element', t => {
    const obj = { block: 'block', mods: {}, elem: 'elem', elemMods: {} };
    const bemjsonNode = new BemjsonNode(obj);

    t.deepEqual(bemjsonNode.valueOf(), obj);
});

test('should create modifier of element', t => {
    const obj = { block: 'block', mods: {}, elem: 'elem', elemMods: { mod: 'val' } };
    const bemjsonNode = new BemjsonNode(obj);

    t.deepEqual(bemjsonNode.valueOf(), obj);
});

test('should create mixes', t => {
    const obj = { block: 'block', mods: {}, mix: [ { block: 'mixed', mods: {} } ] };
    const bemjsonNode = new BemjsonNode(obj);

    t.deepEqual(bemjsonNode.valueOf(), obj);
});
