'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('./util').simplifyCell;
const bemDecl = require('../lib/index');
const decls = {
    v1: [{ name: 'block' }],
    v2: [{ block: 'block' }],
    normalized: { block: 'block' }
};

describe('index', () => {
    it('should have `normalize` method', () => {
        expect(bemDecl.normalize).to.be.a('function');
    });

    it('should support `BEMDECL 1.0` format', () => {
        const decl = bemDecl.normalize(decls.v1, { format: 'v1' });

        expect(decl.map(simplifyCell)).to.deep.equal([{ entity: decls.normalized, tech: null }]);
    });

// TODO: define name of format
    it('should have support `BEMDECL x.0` format', () => {
        const decl = bemDecl.normalize(decls.v2, { v2: true });

        expect(decl.map(simplifyCell)).to.deep.equal([{ entity: decls.normalized, tech: null }]);
    });

    it('should support `BEMDECL 2.0` format', () => {
        const decl = bemDecl.normalize(decls.v2, { harmony: true });

        expect(decl.map(simplifyCell)).to.deep.equal([{ entity: decls.normalized, tech: null }]);
    });

    it('should have `merge` method', () => {
        expect(bemDecl.merge).to.be.a('function');
    });

    it('should have `subtract` method', () => {
        expect(bemDecl.subtract).to.be.a('function');
    });

    it('should have `parse` method', () => {
        expect(bemDecl.parse).to.be.a('function');
    });
});
