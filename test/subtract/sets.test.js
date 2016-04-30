'use strict';

const test = require('ava');
const subtract = require('../../lib/subtract');

test('should subtract set from empty set', t => {
    const A = [{ block: 'A' }];

    t.deepEqual(subtract([], A), []);
});

test('should subtract empty set from set', t => {
    const A = [{ block: 'A' }];

    t.deepEqual(subtract(A, []), A);
});

test('should support disjoint sets', t => {
    const A = [{ block: 'A' }],
        B = [{ block: 'B' }];

    t.deepEqual(subtract(A, B), A);
});

test('should support intersecting sets', t => {
    const ABC = [{ block: 'A' }, { block: 'B' }, { block: 'C' }],
        B   = [{ block: 'B' }],
        AC  = [{ block: 'A' }, { block: 'C' }];

    t.deepEqual(subtract(ABC, B), AC);
});
