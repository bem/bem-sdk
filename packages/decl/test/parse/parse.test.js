'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('../util').simplifyCell;
const parse = require('../../lib/parse');

describe('decl.parse', () => {
    it('should throw if undefined', () => {
        expect(() => parse()).to.throw(/Bemdecl must be String or Object/);
    });

    it('should throw if unsupported', () => {
        expect(() => parse('({ format: \'unknown\', components: [] })')).to.throw(/Unknown BEMDECL format/);
    });

    it('should throw if unsupported in object', () => {
        expect(() => parse({ format: 'unknown', components: [] })).to.throw(/Unknown BEMDECL format/);
    });

    it('should parse blocks property with single entity', () => {
        expect(
            parse('({ format: \'harmony\', decl: [{ block: \'doesnt-matter\', elems: [\'elem\'] }] })').map(simplifyCell)
        ).to.deep.equal([
            { entity: { block: 'doesnt-matter' }, tech: null },
            { entity: { block: 'doesnt-matter', elem: 'elem' }, tech: null }
        ]);
    });

    it('should parse blocks property with single entity of object', () => {
        expect(
            parse({ format: 'harmony', decl: [{ block: 'doesnt-matter', elems: ['elem'] }] }).map(simplifyCell)
        ).to.deep.equal([
            { entity: { block: 'doesnt-matter' }, tech: null },
            { entity: { block: 'doesnt-matter', elem: 'elem' }, tech: null }
        ]);
    });
});
