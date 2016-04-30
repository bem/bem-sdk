var test = require('ava'),
    normalize = require('../../lib/normalize');

test('should support undefined', function (t) {
    t.deepEqual(normalize(), []);
});

test('should support empty array', function (t) {
    t.deepEqual(normalize([]), []);
});

test('should support objects', function (t) {
    t.deepEqual(normalize({ name: 'block' }), [{ block: 'block' }]);
});

test('should return set', function (t) {
    var decl = [
        { name: 'A' },
        { name: 'A' }
    ];

    t.deepEqual(normalize(decl), [
        { block: 'A' }
    ]);
});

test('should save order', function (t) {
    var decl = [
        { name: 'A' },
        { name: 'B' },
        { name: 'A' }
    ];

    t.deepEqual(normalize(decl), [
        { block: 'A' },
        { block: 'B' }
    ]);
});

test('should support array', function (t) {
    var decl = [
        { name: 'A' },
        { name: 'B' }
    ];

    t.deepEqual(normalize(decl), [
        { block: 'A' },
        { block: 'B' }
    ]);
});
