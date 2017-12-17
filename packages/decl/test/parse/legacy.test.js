'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('../util').simplifyCell;
const parse = require('../../lib/parse');

describe('parse.legacy', () => {
    it('should parse empty legacy blocks property', () => {
        expect(parse('({ blocks: [] })')).to.deep.equal([]);
    });

    it('should parse blocks property with single entity', () => {
        expect(parse('({ blocks: [{ name: \'doesnt-matter\' }] })').map(simplifyCell)).to.deep.equal(
            [{ entity: { block: 'doesnt-matter' }, tech: null }]
        );
    });

    it('should parse empty legacy blocks property of object', () => {
        expect(parse({ blocks: [] })).to.deep.equal([]);
    });

    it('should parse blocks property with single entity of object', () => {
        expect(parse({ blocks: [{ name: 'doesnt-matter' }] }).map(simplifyCell)).to.deep.equal(
            [{ entity: { block: 'doesnt-matter' }, tech: null }]
        );
    });
});

