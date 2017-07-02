'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('../util').simplifyCell;
const normalize = require('../../lib/normalize/v2');

describe('normalize2.elems', () => {
    it('should support elems', () => {
        const decl = { block: 'block', elems: 'elem' };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null }
        ]);
    });

    it('should support elems as array', () => {
        const decl = {
            block: 'block',
            elems: ['elem1', 'elem2']
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem1' }, tech: null },
            { entity: { block: 'block', elem: 'elem2' }, tech: null }
        ]);
    });

    it('should support elems as object', () => {
        const decl = {
            block: 'block',
            elems: {
                elem: 'elem'
            }
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null }
        ]);
    });

    it('should support elems as array of objects', () => {
        const decl = {
            block: 'block',
            elems: [
                { elem: 'elem1' },
                { elem: 'elem2' }
            ]
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem1' }, tech: null },
            { entity: { block: 'block', elem: 'elem2' }, tech: null }
        ]);
    });

    it('should support elem of elems as array', () => {
        const decl = {
            block: 'block',
            elems: [
                { elem: ['elem1', 'elem2'] }
            ]
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem1' }, tech: null },
            { entity: { block: 'block', elem: 'elem2' }, tech: null }
        ]);
    });

    it('should support `elems` field without block', () => {
        const decl = {
            elems: ['close', 'open']
        };

        expect(normalize(decl, { entity: { block: 'sb' } }).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'sb' }, tech: null },
            { entity: { block: 'sb', elem: 'close' }, tech: null },
            { entity: { block: 'sb', elem: 'open' }, tech: null }
        ]);
    });

});
