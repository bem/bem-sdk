'use strict';

const test = require('ava');
const intersect = require('../../lib/intersect');

test('should support only one decl', t => {
    const decl = [{ entity: { block: 'block' }, tech: null }];

    t.deepEqual(intersect(decl), []);
});

test('should support several decls', t => {
    const block = [{ entity: { block: 'block' }, tech: null }];

    t.deepEqual(intersect(block, block, block, block), block);
});

test('should intersect set with empty set', t => {
    const decl = [{ entity: { block: 'block' }, tech: null }];

    t.deepEqual(intersect(decl, []), []);
});

test('should intersect disjoint sets', t => {
    const A = [{ entity: { block: 'A' }, tech: null }];
    const B = [{ entity: { block: 'B' }, tech: null }];

    t.deepEqual(intersect(A, B), []);
});

test('should intersect intersecting sets', t => {
    const ABC = [
        { entity: { block: 'A' }, tech: null },
        { entity: { block: 'B' }, tech: null },
        { entity: { block: 'C' }, tech: null }
    ];
    const B = [{ entity: { block: 'B' }, tech: null }];

    t.deepEqual(intersect(ABC, B), B);
});

test('should intersect intersecting sets with different techs', t => {
    const common = { entity: { block: 'C' }, tech: 't1' };
    const ABC = [
        { entity: { block: 'A' }, tech: null },
        { entity: { block: 'B' }, tech: 't1' },
        common
    ];
    const B = [
        { entity: { block: 'B' }, tech: 't2' },
        common
    ];

    t.deepEqual(intersect(ABC, B), [common]);
});
