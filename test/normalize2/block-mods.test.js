'use strict';

const test = require('ava');
const normalize = require('../../lib/normalize2');

test('sould support mods', t => {
    const decl = {
        block: 'block',
        mods: {
            m1: 'v1'
        }
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: undefined },
        { entity: { block: 'block', modName: 'm1', modVal: 'v1' }, tech: undefined },
    ]);
});

test('should pass mods to block', t => {
    const decl = {
        block: 'block',
        elem: 'elem',
        mods: {
            m1: 'v1'
        }
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem' }, tech: undefined },
        { entity: { block: 'block', modName: 'm1', modVal: 'v1' }, tech: undefined }
    ]);
});

test('should support several mods', t => {
    const decl = {
        block: 'block',
        mods: {
            m1: 'v1',
            m2: 'v2'
        }
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: undefined },
        { entity: { block: 'block', modName: 'm1', modVal: 'v1' }, tech: undefined },
        { entity: { block: 'block', modName: 'm2', modVal: 'v2' }, tech: undefined }
    ]);
});

test('should support array of mod values', t => {
    const decl = {
        block: 'block',
        mods: {
            m1: ['v1', 'v2']
        }
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: undefined },
        { entity: { block: 'block', modName: 'm1', modVal: 'v1' }, tech: undefined },
        { entity: { block: 'block', modName: 'm1', modVal: 'v2' }, tech: undefined }
    ]);
});
