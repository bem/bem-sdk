'use strict';

const test = require('ava');
const normalize = require('../../lib/normalize');

test('should support objects', t => {
    const decl = { name: 'block', mods: [{ name: 'mod', vals: [{ name: 'val' }] }] };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', modName: 'mod', modVal: 'val' }
    ]);
});

test('should support several items', t => {
    const decl = { name: 'block', mods: [
        { name: 'mod-1', vals: [{ name: 'val' }] },
        { name: 'mod-2', vals: [{ name: 'val' }] }
    ] };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', modName: 'mod-1', modVal: 'val' },
        { block: 'block', modName: 'mod-2', modVal: 'val' }
    ]);
});

test('should support mod shortcut', t => {
    const decl = { name: 'block', mods: [{ name: 'mod' }] };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', modName: 'mod', modVal: true }
    ]);
});
