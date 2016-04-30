'use strict';

var test = require('ava'),
    merge = require('../../lib/merge');

test('should support only one decl', t => {
    var decl = [{ block: 'block' }];

    t.deepEqual(merge(decl), decl);
});

test('should support several decls', t => {
    var A = [{ block: 'A' }],
        B = [{ block: 'B' }],
        C = [{ block: 'C' }];

    t.deepEqual(merge(A, B, C), [].concat(A, B, C));
});

test('should return set', t => {
    var decl = [{ block: 'block' }];

    t.deepEqual(merge(decl, decl), decl);
});

test('should merge set with empty set', t => {
    var decl = [{ block: 'block' }];

    t.deepEqual(merge(decl, []), decl);
});

test('should merge disjoint sets', t => {
    var A = [{ block: 'A' }],
        B = [{ block: 'B' }];

    t.deepEqual(merge(A, B), [].concat(A, B));
});

test('should merge intersecting sets', t => {
    var ABC = [{ block: 'A' }, { block: 'B' }, { block: 'C' }],
        B = [{ block: 'B' }];

    t.deepEqual(merge(ABC, B), ABC);
});
