'use strict';

const test = require('ava');
const normalize = require('../../lib/normalize2');

test('should support undefined', t => {
    t.deepEqual(normalize(), []);
});

test('should support empty array', t => {
    t.deepEqual(normalize([]), []);
});

test('should support empty object in array', t => {
    t.deepEqual(normalize([{}]), [{ entity: { block: null }, tech: undefined }]);
});

test('should support empty object', t => {
    t.deepEqual(normalize({}), [{ entity: { block: null }, tech: undefined }])
});

test('should return set', t => {
    const A = { block: 'A' };

    t.deepEqual(normalize([A, A]), [{ entity: A, tech: undefined }]);
});

test('should save order', t => {
    const A = { block: 'A' },
        B = { block: 'B' };

    t.deepEqual(normalize([A, B, A]), [
        { entity: A, tech: undefined },
        { entity: B, tech: undefined }
    ]);
});

test('should support array', t => {
    const decl = [
        { block: 'A' },
        { block: 'B' }
    ];

    t.deepEqual(normalize(decl), [
        { entity: { block: 'A' }, tech: undefined },
        { entity: { block: 'B' }, tech: undefined }
    ]);
});
