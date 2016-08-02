'use strict';

const test = require('ava');
const normalize = require('../../lib/normalize2');

test('should support elems', t => {
    const decl = { block: 'block', elems: 'elem' };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem' }, tech: undefined }
    ]);
});

test('should support elems as array', t => {
    const decl = {
        block: 'block',
        elems: ['elem1', 'elem2']
    }

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem1' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem2' }, tech: undefined }
    ]);
});

test('should support elems as object', t => {
    const decl = {
        block: 'block',
        elems: {
            elem: 'elem'
        }
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem' }, tech: undefined }
    ]);
});

test('should support elems as array of objects', t => {
    const decl = {
        block: 'block',
        elems: [
            { elem: 'elem1' },
            { elem: 'elem2' }
        ]
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem1' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem2' }, tech: undefined },
    ]);
});

test('should support elem of elems as array', t => {
    const decl = {
        block: 'block',
        elems: [
            { elem: ['elem1', 'elem2'] }
        ]
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: 'block' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem1' }, tech: undefined },
        { entity: { block: 'block', elem: 'elem2' }, tech: undefined },
    ]);
});

test('should support `elems` field without block', t => {
    const decl = {
        elems: ['close', 'open']
    };

    t.deepEqual(normalize(decl), [
        { entity: { block: null }, tech: undefined },
        { entity: { block: null, elem: 'close' }, tech: undefined },
        { entity: { block: null, elem: 'open' }, tech: undefined }
    ]);
})
