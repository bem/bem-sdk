'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const simplifyCell = require('../util').simplifyCell;
const normalize = require('../../lib/normalize/v2');

describe('normalize2.elem', () => {
    it('should support elem', () => {
        const decl = { block: 'block', elem: 'elem' };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: decl, tech: null }
        ]);
    });

    it('should support elem as array', () => {
        const decl = {
            block: 'block',
            elem: ['elem1', 'elem2']
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', elem: 'elem1' }, tech: null },
            { entity: { block: 'block', elem: 'elem2' }, tech: null }
        ]);
    });

    it('should support elem as object', () => {
        const decl = {
            block: 'block',
            elem: { elem: 'elem' }
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', elem: 'elem' }, tech: null }
        ]);
    });

    it('should support elem as array of objects', () => {
        const decl = {
            block: 'block',
            elem: [
                { elem: 'elem1' },
                { elem: 'elem2' }
            ]
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', elem: 'elem1' }, tech: null },
            { entity: { block: 'block', elem: 'elem2' }, tech: null }
        ]);
    });

    it('should support elem of elem as array', () => {
        const decl = {
            block: 'block',
            elem: [
                { elem: ['elem1', 'elem2'] }
            ]
        };

        expect(normalize(decl).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'block', elem: 'elem1' }, tech: null },
            { entity: { block: 'block', elem: 'elem2' }, tech: null }
        ]);
    });

    it('should support elem without block but with scope', () => {
        const decl = {
            elem: [
                { elem: ['elem1', 'elem2'] }
            ]
        };

        expect(normalize(decl, { entity: { block: 'sb' } }).map(simplifyCell)).to.deep.equal([
            { entity: { block: 'sb', elem: 'elem1' }, tech: null },
            { entity: { block: 'sb', elem: 'elem2' }, tech: null }
        ]);
    });

});
