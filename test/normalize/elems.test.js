'use strict';

const test = require('ava');
const normalize = require('../../lib/normalize');

test('should support arrays', t => {
    const decl = {
        name: 'block',
        elems: [
            { name: 'elem-1' },
            { name: 'elem-2' }
        ]
    };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', elem: 'elem-1' },
        { block: 'block', elem: 'elem-2' }
    ]);
});

test('should support objects', t => {
    const decl = {
        name: 'block',
        elems: [
            { name: 'elem', mods: [{ name: 'mod', vals: [{ name: 'val' }] }] }
        ]
    };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', elem: 'elem' },
        { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
    ]);
});

test('should support mod shortcut', t => {
    const decl = {
        name: 'block',
        elems: [
            { name: 'elem', mods: [{ name: 'mod' }] }
        ]
    };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', elem: 'elem' },
        { block: 'block', elem: 'elem', modName: 'mod', modVal: true }
    ]);
});
