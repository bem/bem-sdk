'use strict';

const test = require('ava');
const normalize = require('../../lib/normalize-harmony');

test('should support mod in block scope', t => {
    const decl = {
        scope: 'block',
        modName: 'mod',
        modVal: 'val'
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: undefined }
    ]);
});

test('should support mods in block scope', t => {
    const decl = {
        scope: 'block',
        mods: { mod: 'val' }
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: undefined }
    ]);
});

test('should support elem in block scope', t => {
    const decl = {
        scope: 'block',
        elem: 'elem'
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block', elem: 'elem' }, tech: undefined }
    ]);
});

test('should support elems in block scope', t => {
    const decl = {
        scope: 'block',
        elems: ['elem-1', 'elem-2']
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block', elem: 'elem-1' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem-2' }, tech: undefined }
    ]);
});

test('should support elem mod in block scope', t => {
    const decl = {
        scope: 'block',
        elem: 'elem', modName: 'mod', modVal: 'val'
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block', elem: 'elem' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: undefined }
    ]);
});

test('should support mod in elem scope', t => {
    const decl = {
        scope: { block: 'block', elem: 'elem' },
        modName: 'mod', modVal: 'val'
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: undefined }
    ]);
});

test('should support mix in elem scope', t => {
    const decl = {
        scope: 'block',
        elems: ['elem-1', 'elem-2'],
        mods: ['mod-1', 'mod-2']
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block', elem: 'elem-1' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem-2' }, tech: undefined },
        { entity: { block: 'block', modName: 'mod-1', modVal: true }, tech: undefined },
        { entity: { block: 'block', modName: 'mod-2', modVal: true }, tech: undefined }
    ]);
});
