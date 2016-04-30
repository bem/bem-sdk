'use strict';

const test = require('ava');
const normalize = require('../../lib/normalize-harmony');

test('should support shortcut for bool mod', t => {
    const decl = { block: 'block', modName: 'mod' };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', modName: 'mod', modVal: true }
    ]);
});

test('should support bool mod', t => {
    const decl = { block: 'block', modName: 'mod', modVal: true };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', modName: 'mod', modVal: true }
    ]);
});

test('should support mod', t => {
    const decl = { block: 'block', modName: 'mod', modVal: 'val' };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', modName: 'mod', modVal: 'val' }
    ]);
});

test('should support mods as objects', t => {
    const decl = {
        block: 'block',
        mods: { mod: 'val' }
    };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', modName: 'mod', modVal: 'val' }
    ]);
});

test('should support bool mods as array', t => {
    const decl = {
        block: 'block',
        mods: ['mod-1', 'mod-2']
    };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', modName: 'mod-1', modVal: true },
        { block: 'block', modName: 'mod-2', modVal: true }
    ]);
});

test('should support mod values as array', t => {
    const decl = {
        block: 'block',
        mods: { mod: ['val-1', 'val-2'] }
    };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', modName: 'mod', modVal: 'val-1' },
        { block: 'block', modName: 'mod', modVal: 'val-2' }
    ]);
});
