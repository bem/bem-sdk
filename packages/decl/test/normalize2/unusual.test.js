'use strict';

const test = require('ava');
const simplifyCell = require('../util').simplifyCell;
const normalize = require('../../lib/normalize/v2');

test('should support both mod and mods', t => {
    const decl = {
        block: 'block',
        mod: 'mod',
        mods: { m1: 'v1' }
    }

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', modName: 'mod', modVal: true }, tech: null },
        { entity: { block: 'block', modName: 'm1', modVal: true }, tech: null },
        { entity: { block: 'block', modName: 'm1', modVal: 'v1' }, tech: null }
    ]);
});

test('should support both elem and elems', t => {
    const decl = {
        block: 'block',
        elem: 'elem1',
        elems: {
            elem: 'elem2'
        }
    };

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', elem: 'elem1' }, tech: null },
        { entity: { block: 'block', elem: 'elem2' }, tech: null }
    ]);
});

test('should support both mod, mods, elem and elems :\'(', t => {
    const decl = {
        block: 'block',
        elem: 'elem1',
        elems: {
            elem: 'elem2'
        },
        mod: 'mod1',
        val: 'v1',
        mods: {
            mod2: 'v2'
        }
    };

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', elem: 'elem1' }, tech: null },
        { entity: { block: 'block', elem: 'elem1', modName: 'mod1', modVal: true }, tech: null },
        { entity: { block: 'block', elem: 'elem1', modName: 'mod1', modVal: 'v1' }, tech: null },
        { entity: { block: 'block', elem: 'elem1', modName: 'mod2', modVal: true }, tech: null },
        { entity: { block: 'block', elem: 'elem1', modName: 'mod2', modVal: 'v2' }, tech: null },
        { entity: { block: 'block', elem: 'elem2' }, tech: null }
    ]);
});
