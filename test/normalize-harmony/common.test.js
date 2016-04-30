'use strict';

const test = require('ava');
const normalize = require('../../lib/normalize-harmony');

test('should support undefined', t => {
    t.deepEqual(normalize(), []);
});

test('should support empty array', t => {
    t.deepEqual(normalize([]), []);
});

test('should support empty object', t => {
    const decl = {};

    t.deepEqual(normalize(decl), []);
});

test('should return set', t => {
    const A = { block: 'A' };

    t.deepEqual(normalize([A, A]), [A]);
});

test('should save order', t => {
    const A = { block: 'A' },
        B = { block: 'B' };

    t.deepEqual(normalize([A, B, A]), [A, B]);
});

test('should support array', t => {
    const decl = [
        { block: 'A' },
        { block: 'B' }
    ];

    t.deepEqual(normalize(decl), decl);
});
