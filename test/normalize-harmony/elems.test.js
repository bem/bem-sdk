'use strict';

const test = require('ava');
const normalize = require('../../lib/normalize-harmony');

test('should support strings', t => {
    const decl = {
        block: 'block',
        elems: ['elem-1', 'elem-2']
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem-1' }, tech: undefined },
        { entity: { block: 'block',  elem: 'elem-2' }, tech: undefined }
    ]);
});

test('should support objects', t => {
    const decl = {
        block: 'block',
        elems: [{ elem: 'elem' }]
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem' }, tech: undefined }
    ]);
});

test('should support mods for elem objects', t => {
    const decl = {
        block: 'block',
        elems: [{ elem: 'elem', mods: { mod: 'val' } }]
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: undefined }
    ]);
});
