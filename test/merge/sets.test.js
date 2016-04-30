var test = require('ava'),
    merge = require('../../lib/merge');

test('should support only one decl', function (t) {
    var decl = [{ block: 'block' }];

    t.deepEqual(merge(decl), decl);
});

test('should support several decls', function (t) {
    var A = [{ block: 'A' }],
        B = [{ block: 'B' }],
        C = [{ block: 'C' }];

    t.deepEqual(merge(A, B, C), [].concat(A, B, C));
});

test('should return set', function (t) {
    var decl = [{ block: 'block' }];

    t.deepEqual(merge(decl, decl), decl);
});

test('should merge set with empty set', function (t) {
    var decl = [{ block: 'block' }];

    t.deepEqual(merge(decl, []), decl);
});

test('should merge disjoint sets', function (t) {
    var A = [{ block: 'A' }],
        B = [{ block: 'B' }];

    t.deepEqual(merge(A, B), [].concat(A, B));
});

test('should merge intersecting sets', function (t) {
    var ABC = [{ block: 'A' }, { block: 'B' }, { block: 'C' }],
        B = [{ block: 'B' }];

    t.deepEqual(merge(ABC, B), ABC);
});
