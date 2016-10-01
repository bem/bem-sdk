'use strict';

const test = require('ava');
const normalize = require('../../lib/normalize');

test('should support undefined', t => {
    t.deepEqual(normalize(), []);
});

test('should support empty array', t => {
    t.deepEqual(normalize([]), []);
});

test('should support objects', t => {
    t.deepEqual(normalize({ name: 'block' }), [{ entity: { block: 'block' }, tech: null }]);
});

test('should return set', t => {
    const decl = [
        { name: 'A' },
        { name: 'A' }
    ];

    t.deepEqual(normalize(decl), [
        { entity: { block: 'A' }, tech: null }
    ]);
});

test('should save order', t => {
    const decl = [
        { name: 'A' },
        { name: 'B' },
        { name: 'A' }
    ];

    t.deepEqual(normalize(decl), [
        { entity: { block: 'A' }, tech: null },
        { entity: { block: 'B' }, tech: null }
    ]);
});

test('should support array', t => {
    const decl = [
        { name: 'A' },
        { name: 'B' }
    ];

    t.deepEqual(normalize(decl), [
        { entity: { block: 'A' }, tech: null },
        { entity: { block: 'B' }, tech: null }
    ]);
});
