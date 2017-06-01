'use strict';

const test = require('ava');
const simplifyCell = require('../util').simplifyCell;
const normalize = require('../../lib/normalize/v2');

test('should support elem as object with mods', t => {
    const decl = {
        block: 'block',
        elem: {
            elem: 'elem',
            mods: {
                mod1: 'v1'
            }
        }
    };

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'block', elem: 'elem' }, tech: null },
        { entity: { block: 'block', elem: 'elem', modName: 'mod1', modVal: true }, tech: null },
        { entity: { block: 'block', elem: 'elem', modName: 'mod1', modVal: 'v1' }, tech: null }
    ]);
});

test('should support elem as object with mods inside and outside', t => {
    const decl = {
        block: 'block',
        elem: {
            elem: 'elem',
            mods: {
                mod1: 'v1'
            }
        },
        mods: { mod2: 'v2' }
    };

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'block', elem: 'elem' }, tech: null },
        { entity: { block: 'block', elem: 'elem', modName: 'mod1', modVal: true }, tech: null },
        { entity: { block: 'block', elem: 'elem', modName: 'mod1', modVal: 'v1' }, tech: null },
        { entity: { block: 'block', elem: 'elem', modName: 'mod2', modVal: true }, tech: null },
        { entity: { block: 'block', elem: 'elem', modName: 'mod2', modVal: 'v2' }, tech: null }
    ]);
});

test('should support elem of elem as array mods', t => {
    const decl = {
        block: 'block',
        elem: [
            {
                elem: ['elem1', 'elem2'],
                mods: {
                    m1: 'v1'
                }
            }
        ]
    };

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'block', elem: 'elem1' }, tech: null },
        { entity: { block: 'block', elem: 'elem1', modName: 'm1', modVal: true }, tech: null },
        { entity: { block: 'block', elem: 'elem1', modName: 'm1', modVal: 'v1' }, tech: null },
        { entity: { block: 'block', elem: 'elem2' }, tech: null },
        { entity: { block: 'block', elem: 'elem2', modName: 'm1', modVal: true }, tech: null },
        { entity: { block: 'block', elem: 'elem2', modName: 'm1', modVal: 'v1' }, tech: null }
    ]);
});

test('should support array of mod values', t => {
    const decl1 = {
        block: 'block',
        elem: 'elem',
        mods: ['m1', 'm2']
    };
    const decl2 = {
        block: 'block',
        elem: ['elem'],
        mods: ['m1', 'm2']
    };
    const result = [
        { entity: { block: 'block', elem: 'elem' }, tech: null },
        { entity: { block: 'block', elem: 'elem', modName: 'm1', modVal: true }, tech: null },
        { entity: { block: 'block', elem: 'elem', modName: 'm2', modVal: true }, tech: null }
    ];

    t.deepEqual(normalize(decl1).map(simplifyCell), result, 'if elem is a string');
    t.deepEqual(normalize(decl2).map(simplifyCell), result, 'if elem is an array');
});
