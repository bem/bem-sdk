'use strict';

const test = require('ava');
const simplifyCell = require('./util').simplifyCell;
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

    t.deepEqual(decl.map(simplifyCell), [{ entity: decls.normalized, tech: null }]);
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
