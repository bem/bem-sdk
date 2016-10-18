'use strict';

const test = require('ava');
const normalize = require('../../lib/normalize/v2');

test('should support elem as object and mod', t => {
    const decl = {
        block: 'block',
        elems: {
            elem: 'elem',
            mods: {
                mod1: 'v1'
            }
        }
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', elem: 'elem' }, tech: null },
        { entity: { block: 'block', elem: 'elem', modName: 'mod1', modVal: true }, tech: null },
        { entity: { block: 'block', elem: 'elem', modName: 'mod1', modVal: 'v1' }, tech: null }
    ]);
});

test('should support elem of elem as array mods', t => {
    const decl = {
        block: 'block',
        elems: [
            {
                elem: ['elem1', 'elem2'],
                mods: {
                    m1: 'v1'
                }
            }
        ]
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', elem: 'elem1' }, tech: null },
        { entity: { block: 'block', elem: 'elem1', modName: 'm1', modVal: true }, tech: null },
        { entity: { block: 'block', elem: 'elem1', modName: 'm1', modVal: 'v1' }, tech: null },
        { entity: { block: 'block', elem: 'elem2' }, tech: null },
        { entity: { block: 'block', elem: 'elem2', modName: 'm1', modVal: true }, tech: null },
        { entity: { block: 'block', elem: 'elem2', modName: 'm1', modVal: 'v1' }, tech: null }
    ]);
});

test('should support mods in elems and block', t => {
    const decl = {
        block: 'block',
        mods: {
            m1: 'v1'
        },
        elems: [
            {
                elem: 'elem',
                mods: {
                    m2: 'v2'
                }
            }
        ]
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', modName: 'm1', modVal: true }, tech: null },
        { entity: { block: 'block', modName: 'm1', modVal: 'v1' }, tech: null },
        { entity: { block: 'block', elem: 'elem' }, tech: null },
        { entity: { block: 'block', elem: 'elem', modName: 'm2', modVal: true }, tech: null },
        { entity: { block: 'block', elem: 'elem', modName: 'm2', modVal: 'v2' }, tech: null }
    ]);
});

test('should support block mods with `elems` field without block', t => {
    const decl = [
        {
            elems: ['close'],
            mods: { theme: 'protect' }
        }
    ];

    t.deepEqual(normalize(decl), [
        { entity: { block: null }, tech: null },
        { entity: { block: null, modName: 'theme', modVal: true }, tech: null },
        { entity: { block: null, modName: 'theme', modVal: 'protect' }, tech: null },
        { entity: { block: null, elem: 'close' }, tech: null }
    ]);
})
