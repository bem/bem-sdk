'use strict';

const test = require('ava');
const createCell = require('../util').createCell;
const simplifyCell = require('../util').simplifyCell;
const normalize = require('../../lib/normalize/v2');

test('should support mod and mods with scope block, elem', t => {
    const scope = createCell({ entity: { block: 'sb' } });
    const decl = [
        { mod: 'mod', val: 'val' },
        { mods: { mod1: 'val1' } }
    ];

    t.deepEqual(normalize(decl, scope).map(simplifyCell), [
        { entity: { block: 'sb', modName: 'mod', modVal: true }, tech: null },
        { entity: { block: 'sb', modName: 'mod', modVal: 'val' }, tech: null },
        { entity: { block: 'sb' }, tech: null },
        { entity: { block: 'sb', modName: 'mod1', modVal: true }, tech: null },
        { entity: { block: 'sb', modName: 'mod1', modVal: 'val1' }, tech: null }
    ]);
});

test('should support mod without block & elem but with scope', t => {
    const scope = createCell({ entity: { block: 'sb' } });
    const decl = { mod: 'mod', val: 'val' };

    t.deepEqual(normalize(decl, scope).map(simplifyCell), [
        { entity: { block: 'sb', modName: 'mod', modVal: true }, tech: null },
        { entity: { block: 'sb', modName: 'mod', modVal: 'val' }, tech: null }
    ]);
});

test('should support mods without block & elem', t => {
    const scope = createCell({ entity: { block: 'sb' } });
    const decl = { mods: { mod: 'val' } };

    t.deepEqual(normalize(decl, scope).map(simplifyCell), [
        { entity: { block: 'sb' }, tech: null },
        { entity: { block: 'sb', modName: 'mod', modVal: true }, tech: null },
        { entity: { block: 'sb', modName: 'mod', modVal: 'val' }, tech: null }
    ]);
});

test('should support only vals', t => {
    const scope = createCell({ entity: { block: 'sb', modName: 'sm' } });
    const decl = { val: 'val' };

    t.deepEqual(normalize(decl, scope).map(simplifyCell), [
        { entity: { block: 'sb', modName: 'sm', modVal: true }, tech: null },
        { entity: { block: 'sb', modName: 'sm', modVal: 'val' }, tech: null }
    ]);
});
