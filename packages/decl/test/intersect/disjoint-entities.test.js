'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const createCell = require('../util').createCell;

const intersect = require('../../lib/intersect');

describe('intersect.disjoint-entities', () => {
    it('should not intersect other entities from block', () => {
        const decl1 = [{ entity: { block: 'block' }, tech: null }].map(createCell);
        const decl2 = [
            { entity: { block: 'block', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null }
        ].map(createCell);

        expect(intersect(decl1, decl2)).to.deep.equal([]);
    });

    it('should not intersect other entities from bool mod', () => {
        const decl1 = [{ entity: { block: 'block', modName: 'mod', modVal: true }, tech: null }].map(createCell);
        const decl2 = [
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null }
        ].map(createCell);

        expect(intersect(decl1, decl2)).to.deep.equal([]);
    });

    it('should not intersect other entities from mod', () => {
        const decl1 = [{ entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null }].map(createCell);
        const decl2 = [
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null }
        ].map(createCell);

        expect(intersect(decl1, decl2)).to.deep.equal([]);
    });

    it('should not intersect other entities from elem', () => {
        const decl1 = [{ entity: { block: 'block', elem: 'elem' }, tech: null }].map(createCell);
        const decl2 = [
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null }
        ].map(createCell);

        expect(intersect(decl1, decl2)).to.deep.equal([]);
    });

    it('should not intersect other entities from bool mod of elem', () => {
        const decl1 = [
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true }, tech: null }
        ].map(createCell);
        const decl2 = [
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null }
        ].map(createCell);

        expect(intersect(decl1, decl2)).to.deep.equal([]);
    });

    it('should not intersect other entities from mod of elem', () => {
        const decl1 = [
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }, tech: null }
        ].map(createCell);
        const decl2 = [
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: true }, tech: null },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true }, tech: null }
        ].map(createCell);

        expect(intersect(decl1, decl2)).to.deep.equal([]);
    });
});
