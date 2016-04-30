'use strict';

const test = require('ava');
const intersect = require('../../lib/intersect');

test('should support only one decl', t => {
    const decl = [{ block: 'block' }];

    t.deepEqual(intersect(decl), []);
});

test('should support several decls', t => {
    const block = [{ block: 'block' }];

    t.deepEqual(intersect(block, block, block, block), block);
});

test('should intersect set with empty set', t => {
    const decl = [{ block: 'block' }];

    t.deepEqual(intersect(decl, []), []);
});

test('should intersect disjoint sets', t => {
    const A = [{ block: 'A' }];
    const B = [{ block: 'B' }];

    t.deepEqual(intersect(A, B), []);
});

test('should intersect intersecting sets', t => {
    const ABC = [{ block: 'A' }, { block: 'B' }, { block: 'C' }];
    const B = [{ block: 'B' }];

    t.deepEqual(intersect(ABC, B), B);
});
