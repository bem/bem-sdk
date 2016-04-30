'use strict';

const test = require('ava');
const merge = require('../../lib/merge');

test('should merge block with its elem', t => {
    const block = { block: 'block' };
    const elem = { block: 'block', elem: 'elem' };

    t.deepEqual(merge([block], [elem]), [block, elem]);
});

test('should merge block with its mod', t => {
    const block = { block: 'block' };
    const mod = { block: 'block', modName: 'mod', modVal: 'val' };

    t.deepEqual(merge([block], [mod]), [block, mod]);
});

test('should merge block with its bool mod', t => {
    const block = { block: 'block' };
    const mod = { block: 'block', modName: 'mod', modVal: true };

    t.deepEqual(merge([block], [mod]), [block, mod]);
});

test('should merge elems of block', t => {
    const elem1 = { block: 'block', elem: 'elem-1' };
    const elem2 = { block: 'block', elem: 'elem-2' };

    t.deepEqual(merge([elem1], [elem2]), [elem1, elem2]);
});

test('should merge mods of block', t => {
    const mod1 = { block: 'block', modName: 'mod-1', modVal: true };
    const mod2 = { block: 'block', modName: 'mod-2', modVal: true };

    t.deepEqual(merge([mod1], [mod2]), [mod1, mod2]);
});

test('should merge mod vals of block mod', t => {
    const val1 = { block: 'block', modName: 'mod', modVal: 'val-1' };
    const val2 = { block: 'block', modName: 'mod', modVal: 'val-2' };

    t.deepEqual(merge([val1], [val2]), [val1, val2]);
});

test('should merge elem with its mod', t => {
    const elem = { block: 'block', elem: 'elem' };
    const mod = { block: 'block', elem: 'elem' , modName: 'mod', modVal: 'val' };

    t.deepEqual(merge([elem], [mod]), [elem, mod]);
});

test('should merge elem with its bool mod', t => {
    const elem = { block: 'block', elem: 'elem' };
    const mod = { block: 'block', elem: 'elem' , modName: 'mod', modVal: true };

    t.deepEqual(merge([elem], [mod]), [elem, mod]);
});

test('should merge mods of elem', t => {
    const mod1 = { block: 'block', elem: 'elem', modName: 'mod-1', modVal: true };
    const mod2 = { block: 'block', elem: 'elem', modName: 'mod-2', modVal: true };

    t.deepEqual(merge([mod1], [mod2]), [mod1, mod2]);
});

test('should merge mod vals of elem mod', t => {
    const val1 = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-1' };
    const val2 = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-2' };

    t.deepEqual(merge([val1], [val2]), [val1, val2]);
});
