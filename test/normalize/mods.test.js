'use strict';

const test = require('ava');
const normalize = require('../../lib/normalize/v1');

test('should support objects', t => {
    const decl = { name: 'block', mods: [{ name: 'mod', vals: [{ name: 'val' }] }] };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null }
    ]);
});

test('should support several items', t => {
    const decl = { name: 'block', mods: [
        { name: 'mod-1', vals: [{ name: 'val' }] },
        { name: 'mod-2', vals: [{ name: 'val' }] }
    ] };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', modName: 'mod-1', modVal: 'val' }, tech: null },
        { entity: { block: 'block', modName: 'mod-2', modVal: 'val' }, tech: null }
    ]);
});

test('should support mod shortcut', t => {
    const decl = { name: 'block', mods: [{ name: 'mod' }] };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', modName: 'mod', modVal: true }, tech: null }
    ]);
});
