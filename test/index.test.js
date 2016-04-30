'use strict';

const test = require('ava');
const bemDecl = require('../lib/index');
const decls = {
    v1: [{ name: 'block' }],
    v2: [{ block: 'block' }]
};

test('should have `normalize` method', t => {
    t.truthy(typeof bemDecl.normalize === 'function');
});

test('should support `BEMDECL 1.0` format', t => {
    var decl = bemDecl.normalize(decls.v1);

    t.deepEqual(decl, decls.v2);
});

test('should support `BEMDECL 2.0` format', t => {
    var decl = bemDecl.normalize(decls.v2, { harmony: true });

    t.deepEqual(decl, decls.v2);
});

test('should have `merge` method', t => {
    t.truthy(typeof bemDecl.merge === 'function');
});

test('should have `subtract` method', t => {
    t.truthy(typeof bemDecl.subtract === 'function');
});
