var test = require('ava'),
    normalize = require('../../lib/normalize-harmony');

test('should support undefined', function (t) {
    t.deepEqual(normalize(), []);
});

test('should support empty array', function (t) {
    t.deepEqual(normalize([]), []);
});

test('should support empty object', function (t) {
    var decl = {};

    t.deepEqual(normalize(decl), []);
});

test('should return set', function (t) {
    var A = { block: 'A' };

    t.deepEqual(normalize([A, A]), [A]);
});

test('should save order', function (t) {
    var A = { block: 'A' },
        B = { block: 'B' };

    t.deepEqual(normalize([A, B, A]), [A, B]);
});

test('should support array', function (t) {
    var decl = [
        { block: 'A' },
        { block: 'B' }
    ];

    t.deepEqual(normalize(decl), decl);
});
