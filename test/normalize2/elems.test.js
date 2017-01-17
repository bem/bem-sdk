'use strict';

const test = require('ava');
const simplifyCell = require('../util').simplifyCell;
const normalize = require('../../lib/normalize/v2');

test('should support elems', t => {
    const decl = { block: 'block', elems: 'elem' };

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', elem: 'elem' }, tech: null }
    ]);
});

test('should support elems as array', t => {
    const decl = {
        block: 'block',
        elems: ['elem1', 'elem2']
    }

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', elem: 'elem1' }, tech: null },
        { entity: { block: 'block', elem: 'elem2' }, tech: null }
    ]);
});

test('should support elems as object', t => {
    const decl = {
        block: 'block',
        elems: {
            elem: 'elem'
        }
    };

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', elem: 'elem' }, tech: null }
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

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', elem: 'elem1' }, tech: null },
        { entity: { block: 'block', elem: 'elem2' }, tech: null },
    ]);
});

test('should support elem of elems as array', t => {
    const decl = {
        block: 'block',
        elems: [
            { elem: ['elem1', 'elem2'] }
        ]
    };

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'block' }, tech: null },
        { entity: { block: 'block', elem: 'elem1' }, tech: null },
        { entity: { block: 'block', elem: 'elem2' }, tech: null },
    ]);
});

test('should support `elems` field without block', t => {
    const decl = {
        elems: ['close', 'open']
    };

    t.deepEqual(normalize(decl, { entity: { block: 'sb' } }).map(simplifyCell), [
        { entity: { block: 'sb' }, tech: null },
        { entity: { block: 'sb', elem: 'close' }, tech: null },
        { entity: { block: 'sb', elem: 'open' }, tech: null }
    ]);
})
