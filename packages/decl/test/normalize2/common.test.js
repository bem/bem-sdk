'use strict';

const test = require('ava');
const simplifyCell = require('../util').simplifyCell;
const normalize = require('../../lib/normalize/v2');

test('should support undefined', t => {
    t.deepEqual(normalize(), []);
});

test('should support empty array', t => {
    t.deepEqual(normalize([]), []);
});

test('should support empty object in array', t => {
    t.deepEqual(normalize([{}], { entity: { block: 'sb' } }).map(simplifyCell),
        [{ entity: { block: 'sb' }, tech: null }]);
});

test('should support empty object with scope', t => {
    t.deepEqual(normalize({}, { entity: { block: 'sb' } }).map(simplifyCell),
        [{ entity: { block: 'sb' }, tech: null }])
});

test('should return set', t => {
    const A = { block: 'A' };

    t.deepEqual(normalize([A, A]).map(simplifyCell), [{ entity: A, tech: null }]);
});

test('should save order', t => {
    const A = { block: 'A' },
        B = { block: 'B' };

    t.deepEqual(normalize([A, B, A]).map(simplifyCell), [
        { entity: A, tech: null },
        { entity: B, tech: null }
    ]);
});

test('should support array', t => {
    const decl = [
        { block: 'A' },
        { block: 'B' }
    ];

    t.deepEqual(normalize(decl).map(simplifyCell), [
        { entity: { block: 'A' }, tech: null },
        { entity: { block: 'B' }, tech: null }
    ]);
});
