'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemEntityName = require('..');

describe('belongs-to', () => {
    it('should not detect belonging between block and itself', () => {
        const blockName = new BemEntityName({ block: 'block' });

        expect(blockName.belongsTo(blockName)).to.be.false;
    });

    it('should not detect belonging between elem and itself', () => {
        const elemName = new BemEntityName({ block: 'block', elem: 'elem' });

        expect(elemName.belongsTo(elemName)).to.be.false;
    });

    it('should not detect belonging between block mod and itself', () => {
        const modName = new BemEntityName({ block: 'block', mod: 'mod' });

        expect(modName.belongsTo(modName)).to.be.false;
    });

    it('should not detect belonging between elem mod and itself', () => {
        const modName = new BemEntityName({ block: 'block', elem: 'elem', mod: 'mod' });

        expect(modName.belongsTo(modName)).to.be.false;
    });

    it('should resolve belonging between block and its elem', () => {
        const blockName = new BemEntityName({ block: 'block' });
        const elemName = new BemEntityName({ block: 'block', elem: 'elem' });

        expect(elemName.belongsTo(blockName)).to.be.true;
        expect(blockName.belongsTo(elemName)).to.be.false;
    });

    it('should not detect belonging between two block', () => {
        const name1 = new BemEntityName({ block: 'block1' });
        const name2 = new BemEntityName({ block: 'block2' });

        expect(name1.belongsTo(name2)).to.be.false;
        expect(name2.belongsTo(name1)).to.be.false;
    });

    it('should not detect belonging between two mods of block', () => {
        const modName1 = new BemEntityName({ block: 'block', mod: 'mod1' });
        const modName2 = new BemEntityName({ block: 'block', mod: 'mod2' });

        expect(modName1.belongsTo(modName2)).to.be.false;
        expect(modName2.belongsTo(modName1)).to.be.false;
    });

    it('should not detect belonging between two elems of block', () => {
        const elemName1 = new BemEntityName({ block: 'block', elem: 'elem1' });
        const elemName2 = new BemEntityName({ block: 'block', elem: 'elem2' });

        expect(elemName1.belongsTo(elemName2)).to.be.false;
        expect(elemName2.belongsTo(elemName1)).to.be.false;
    });

    it('should resolve belonging between block and its mod', () => {
        const blockName = new BemEntityName({ block: 'block' });
        const modName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'key' } });

        expect(modName.belongsTo(blockName)).to.be.true;
        expect(blockName.belongsTo(modName)).to.be.false;
    });

    it('should resolve belonging between elem and its mod', () => {
        const elemName = new BemEntityName({ block: 'block', elem: 'elem' });
        const modName = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: 'key' } });

        expect(modName.belongsTo(elemName)).to.be.true;
        expect(elemName.belongsTo(modName)).to.be.false;
    });

    it('should not detect belonging between block and its elem mod', () => {
        const blockName = new BemEntityName({ block: 'block' });
        const elemModName = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: 'key' } });

        expect(elemModName.belongsTo(blockName)).to.be.false;
        expect(blockName.belongsTo(elemModName)).to.be.false;
    });

    it('should not detect belonging between block mod and its elem with the same mod', () => {
        const blockModName = new BemEntityName({ block: 'block', mod: 'mod' });
        const elemModName = new BemEntityName({ block: 'block', elem: 'elem', mod: 'mod' });

        expect(elemModName.belongsTo(blockModName)).to.be.false;
        expect(blockModName.belongsTo(elemModName)).to.be.false;
    });

    it('should not detect belonging between boolean and key-value mod of block', () => {
        const boolModName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: true } });
        const modName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'key' } });

        expect(modName.belongsTo(boolModName)).to.be.false;
        expect(boolModName.belongsTo(modName)).to.be.false;
    });

    it('should not detect belonging between boolean and key-value mod of element', () => {
        const boolModName = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: true } });
        const modName = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: 'key' } });

        expect(modName.belongsTo(boolModName)).to.be.false;
        expect(boolModName.belongsTo(modName)).to.be.false;
    });

    it('should not detect belonging between key-value mods of block', () => {
        const modName1 = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'key1' } });
        const modName2 = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'key2' } });

        expect(modName1.belongsTo(modName2)).to.be.false;
        expect(modName2.belongsTo(modName1)).to.be.false;
    });

    it('should not detect belonging between key-value mods of elem', () => {
        const modName1 = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: 'key1' } });
        const modName2 = new BemEntityName({ block: 'block', elem: 'elem', mod: { name: 'mod', val: 'key2' } });

        expect(modName1.belongsTo(modName2)).to.be.false;
        expect(modName2.belongsTo(modName1)).to.be.false;
    });
});
