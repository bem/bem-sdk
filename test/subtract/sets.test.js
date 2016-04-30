var test = require('ava'),
    subtract = require('../../lib/subtract');

test('should subtract set from empty set', function (t) {
    var A = [{ block: 'A' }];

    t.deepEqual(subtract([], A), []);
});

test('should subtract empty set from set', function (t) {
    var A = [{ block: 'A' }];

    t.deepEqual(subtract(A, []), A);
});

test('should support disjoint sets', function (t) {
    var A = [{ block: 'A' }],
        B = [{ block: 'B' }];

    t.deepEqual(subtract(A, B), A);
});

test('should support intersecting sets', function (t) {
    var ABC = [{ block: 'A' }, { block: 'B' }, { block: 'C' }],
        B   = [{ block: 'B' }],
        AC  = [{ block: 'A' }, { block: 'C' }];

    t.deepEqual(subtract(ABC, B), AC);
});
