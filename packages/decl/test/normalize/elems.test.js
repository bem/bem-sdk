'use strict';

const test = require('ava');
const simplifyCell = require('../util').simplifyCell;
const normalize = require('../../lib/normalize/v1');

test('should support arrays', t => {
    const decl = {
        name: 'block',
        elems: [
            { name: 'elem-1' },
            { name: 'elem-2' }
        ]
    };

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', elem: 'elem-1' }, tech: null },
        { entity: { block: 'block', elem: 'elem-2' }, tech: null }
    ]);
});

test('should support objects', t => {
    const decl = {
        name: 'block',
        elems: [
            { name: 'elem', mods: [{ name: 'mod', vals: [{ name: 'val' }] }] }
        ]
    };

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', elem: 'elem' }, tech: null },
        { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null }
    ]);
});

test('should support mod shortcut', t => {
    const decl = {
        name: 'block',
        elems: [
            { name: 'elem', mods: [{ name: 'mod' }] }
        ]
    };

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', elem: 'elem' }, tech: null },
        { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true }, tech: null }
    ]);
});
