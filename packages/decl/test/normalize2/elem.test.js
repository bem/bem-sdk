'use strict';

const test = require('ava');
const simplifyCell = require('../util').simplifyCell;
const normalize = require('../../lib/normalize/v2');

test('should support elem', t => {
    const decl = { block: 'block', elem: 'elem' };

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: decl, tech: null }
    ]);
});

test('should support elem as array', t => {
    const decl = {
        block: 'block',
        elem: ['elem1', 'elem2']
    }

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'block', elem: 'elem1' }, tech: null },
        { entity: { block: 'block', elem: 'elem2' }, tech: null }
    ]);
});

test('should support elem as object', t => {
    const decl = {
        block: 'block',
        elem: { elem: 'elem' }
    };

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'block', elem: 'elem' }, tech: null }
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

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'block', elem: 'elem1' }, tech: null },
        { entity: { block: 'block', elem: 'elem2' }, tech: null }
    ]);
});

test('should support elem of elem as array', t => {
    const decl = {
        block: 'block',
        elem: [
            { elem: ['elem1', 'elem2'] }
        ]
    };

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'block', elem: 'elem1' }, tech: null },
        { entity: { block: 'block', elem: 'elem2' }, tech: null }
    ]);
});

test('should support elem without block but with scope', t => {
    const decl = {
        elem: [
            { elem: ['elem1', 'elem2'] }
        ]
    };

    t.deepEqual(normalize(decl, { entity: { block: 'sb' } }).map(simplifyCell), [
        { entity: { block: 'sb', elem: 'elem1' }, tech: null },
        { entity: { block: 'sb', elem: 'elem2' }, tech: null }
    ]);
});
