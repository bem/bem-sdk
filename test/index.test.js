'use strict';

const test = require('ava');
const bemDecl = require('../lib/index');
const decls = {
    v1: [{ name: 'block' }],
    v2: [{ block: 'block' }],
    normalized: { block: 'block' }
};

test('should have `normalize` method', t => {
    t.truthy(typeof bemDecl.normalize === 'function');
});

test('should support `BEMDECL 1.0` format', t => {
    var decl = bemDecl.normalize(decls.v1, { format: 'v1' });

    t.deepEqual(decl, [{ entity: decls.normalized, tech: null }]);
});

// TODO: define name of format
test('should have support `BEMDECL x.0` format', t => {
    var decl = bemDecl.normalize(decls.v2, { v2: true });

    t.deepEqual(decl, [{ entity: decls.normalized, tech: null }]);
})

test('should support `BEMDECL 2.0` format', t => {
    var decl = bemDecl.normalize(decls.v2, { harmony: true });

    t.deepEqual(decl, [{ entity: decls.normalized, tech: null }]);
});

test('should have `normalizer` method', t => {
    t.truthy(typeof bemDecl.normalizer === 'function');
});

test('normalizer should support default value as `normalize`', t => {
    var decl = bemDecl.normalizer('v1')(decls.v1);

    t.deepEqual(decl, [{ entity: decls.normalized, tech: null }]);
});

test('should support `BEMDECL 1.0` format through normalizer', t => {
    var decl = bemDecl.normalizer('v1')(decls.v1);

    t.deepEqual(decl, [{ entity: decls.normalized, tech: null }]);
});

// TODO: define name of format
test('should have support `BEMDECL x.0` format through normalizer', t => {
    var decl = bemDecl.normalizer('v2')(decls.v2);

    t.deepEqual(decl, [{ entity: decls.normalized, tech: null }]);
})

test('should support `BEMDECL 2.0` format through normalizer', t => {
    var decl = bemDecl.normalizer('harmony')(decls.v2);

    t.deepEqual(decl, [{ entity: decls.normalized, tech: null }]);
});

test('should support uncorrect normalizer arg with default result', t => {
    var decl = bemDecl.normalizer('levoe')(decls.v2);

    t.deepEqual(decl, [{ entity: decls.normalized, tech: null }]);
});

test('should have `merge` method', t => {
    t.truthy(typeof bemDecl.merge === 'function');
});

test('should have `subtract` method', t => {
    t.truthy(typeof bemDecl.subtract === 'function');
});

test('should have `parse` method', t => {
    t.truthy(typeof bemDecl.parse === 'function');
});
