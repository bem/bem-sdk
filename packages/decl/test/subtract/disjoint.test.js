'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemCell = require('@bem/sdk.cell');
const createCell = BemCell.create;

const subtract = require('../../lib/subtract');

describe('subtract.disjoint', () => {
    it('should not subtract other entities from block', () => {
        const decl1 = [{ entity: { block: 'block' } }].map(createCell);
        const decl2 = [
            { entity: { block: 'block', modName: 'mod', modVal: true } },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' } },
            { entity: { block: 'block', elem: 'elem' } },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true } },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } }
        ].map(createCell);

        expect(subtract(decl1, decl2)).to.deep.equal(decl1);
    });

    it('should not subtract other entities from bool mod', () => {
        const decl1 = [{ entity: { block: 'block', modName: 'mod', modVal: true } }].map(createCell);
        const decl2 = [
            { entity: { block: 'block' } },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' } },
            { entity: { block: 'block', elem: 'elem' } },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true } },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } }
        ].map(createCell);

        expect(subtract(decl1, decl2)).to.deep.equal(decl1);
    });

    it('should not subtract other entities from mod', () => {
        const decl1 = [{ entity: { block: 'block', modName: 'mod', modVal: 'val' } }].map(createCell);
        const decl2 = [
            { entity: { block: 'block' } },
            { entity: { block: 'block', modName: 'mod', modVal: true } },
            { entity: { block: 'block', elem: 'elem' } },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true } },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } }
        ].map(createCell);

        expect(subtract(decl1, decl2)).to.deep.equal(decl1);
    });

    it('should not subtract other entities from elem', () => {
        const decl1 = [{ entity: { block: 'block', elem: 'elem' } }].map(createCell);
        const decl2 = [
            { entity: { block: 'block' } },
            { entity: { block: 'block', modName: 'mod', modVal: true } },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' } },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true } },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } }
        ].map(createCell);

        expect(subtract(decl1, decl2)).to.deep.equal(decl1);
    });

    it('should not subtract other entities from bool mod of elem', () => {
        const decl1 = [{ entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true } }].map(createCell);
        const decl2 = [
            { entity: { block: 'block' } },
            { entity: { block: 'block', modName: 'mod', modVal: true } },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' } },
            { entity: { block: 'block', elem: 'elem' } },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } }
        ].map(createCell);

        expect(subtract(decl1, decl2)).to.deep.equal(decl1);
    });

    it('should not subtract other entities from mod of elem', () => {
        const decl1 = [{ entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } }].map(createCell);
        const decl2 = [
            { entity: { block: 'block' } },
            { entity: { block: 'block', modName: 'mod', modVal: true } },
            { entity: { block: 'block', modName: 'mod', modVal: 'val' } },
            { entity: { block: 'block', elem: 'elem' } },
            { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true } }
        ].map(createCell);

        expect(subtract(decl1, decl2)).to.deep.equal(decl1);
    });
});
