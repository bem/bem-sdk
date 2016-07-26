'use strict';

const test = require('ava');
const normalize = require('../../lib/normalize2');

test('should support elem', t => {
    const decl = { block: 'block', elem: 'elem' };

    t.deepEqual(normalize(decl), [
        { entity: decl, tech: undefined }
    ]);
});

test('should support elem as array', t => {
    const decl = {
        block: 'block',
        elem: ['elem1', 'elem2']
    }

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block', elem: 'elem1' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem2' }, tech: undefined }
    ]);
});

test('should support elem as object', t => {
    const decl = {
        block: 'block',
        elem: { elem: 'elem' }
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block', elem: 'elem' }, tech: undefined }
    ]);
});

test('should support elem as array of objects', t => {
    const decl = {
        block: 'block',
        elem: [
            { elem: 'elem1' },
            { elem: 'elem2' }
        ]
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block', elem: 'elem1' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem2' }, tech: undefined }
    ]);
});

test('should support elem of elem as array', t => {
    const decl = {
        block: 'block',
        elem: [
            { elem: ['elem1', 'elem2'] }
        ]
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block', elem: 'elem1' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem2' }, tech: undefined }
    ]);
});
