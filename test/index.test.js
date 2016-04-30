var test = require('ava'),
    bemDecl = require('../lib/index'),
    decls = {
        v1: [{ name: 'block' }],
        v2: [{ block: 'block' }]
    };

test('should have `normalize` method', function (t) {
    t.truthy(typeof bemDecl.normalize === 'function');
});

test('should support `BEMDECL 1.0` format', function (t) {
    var decl = bemDecl.normalize(decls.v1);

    t.deepEqual(decl, decls.v2);
});

test('should support `BEMDECL 2.0` format', function (t) {
    var decl = bemDecl.normalize(decls.v2, { harmony: true });

    t.deepEqual(decl, decls.v2);
});

test('should have `merge` method', function (t) {
    t.truthy(typeof bemDecl.merge === 'function');
});

test('should have `subtract` method', function (t) {
    t.truthy(typeof bemDecl.subtract === 'function');
});
