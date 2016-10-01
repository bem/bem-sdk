'use strict';

const test = require('ava');
const normalize = require('../../lib/normalize2');

test('should support elem as object and mod', t => {
    const decl = {
        block: 'block',
        elem: {
            elem: 'elem',
            mods: {
                mod1: 'v1'
            }
        }
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block', elem: 'elem' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem', modName: 'mod1', modVal: true }, tech: undefined },
        { entity: { block: 'block', elem: 'elem', modName: 'mod1', modVal: 'v1' }, tech: undefined }
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

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block', elem: 'elem1' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem1', modName: 'm1', modVal: true }, tech: undefined },
        { entity: { block: 'block', elem: 'elem1', modName: 'm1', modVal: 'v1' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem2' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem2', modName: 'm1', modVal: true }, tech: undefined },
        { entity: { block: 'block', elem: 'elem2', modName: 'm1', modVal: 'v1' }, tech: undefined }
    ]);
});

test('should support array of mod values', t => {
    const decl = {
        block: 'block',
        elem: 'elem',
        mods: ['m1', 'm2']
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block', elem: 'elem' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem', modName: 'm1', modVal: true }, tech: undefined },
        { entity: { block: 'block', elem: 'elem', modName: 'm2', modVal: true }, tech: undefined }
    ]);
});
