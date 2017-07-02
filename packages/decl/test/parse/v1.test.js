'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('../util').simplifyCell;
const parse = require('../..').parse;

describe('parse.v1', () => {
    it('should parse empty legacy blocks property', () => {
        expect(parse('({ format: \'v1\', blocks: [] })')).to.deep.equal([]);
    });

    it('should parse blocks property with single entity', () => {
        expect(parse('({ format: \'v1\', blocks: [{ name: \'doesnt-matter\' }] })').map(simplifyCell)).to.deep.equal(
            [{ entity: { block: 'doesnt-matter' }, tech: null }]
        );
    });

    it('should parse empty legacy blocks property of object', () => {
        expect(parse({ format: 'v1', blocks: [] })).to.deep.equal([]);
    });

    it('should parse blocks property with single entity of object', () => {
        expect(parse({ format: 'v1', blocks: [{ name: 'doesnt-matter' }] }).map(simplifyCell)).to.deep.equal(
            [{ entity: { block: 'doesnt-matter' }, tech: null }]
        );
    });
});
