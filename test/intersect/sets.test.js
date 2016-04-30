var test = require('ava'),
    intersect = require('../../lib/intersect');

test('should support only one decl', function (t) {
    var decl = [{ block: 'block' }];

    t.deepEqual(intersect(decl), []);
});

test('should support several decls', function (t) {
    var block = [{ block: 'block' }];

    t.deepEqual(intersect(block, block, block, block), block);
});

test('should intersect set with empty set', function (t) {
    var decl = [{ block: 'block' }];

    t.deepEqual(intersect(decl, []), []);
});

test('should intersect disjoint sets', function (t) {
    var A = [{ block: 'A' }],
        B = [{ block: 'B' }];

    t.deepEqual(intersect(A, B), []);
});

test('should intersect intersecting sets', function (t) {
    var ABC = [{ block: 'A' }, { block: 'B' }, { block: 'C' }],
        B = [{ block: 'B' }];

    t.deepEqual(intersect(ABC, B), B);
});
