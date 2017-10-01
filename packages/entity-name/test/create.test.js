'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemEntityName = require('..');

describe('create', () => {
    it('should return object as is if it`s a BemEntityName', () => {
        const entityName = new BemEntityName({ block: 'block' });

        expect(BemEntityName.create(entityName)).to.equal(entityName);
    });

    it('should create block from object', () => {
        const entityName = BemEntityName.create({ block: 'block' });

        expect(entityName instanceof BemEntityName, 'Should be an instance of BemEntityName').to.be.true;
        expect(entityName.valueOf(), 'Should contain a name for same entity').to.deep.equal({ block: 'block' });
    });

    it('should create block by a string', () => {
        const entityName = BemEntityName.create('block');

        expect(entityName.valueOf()).to.deep.equal({ block: 'block' });
    });

    it('should create element from object', () => {
        const entityName = BemEntityName.create({ block: 'block', elem: 'elem' });

        expect(entityName.valueOf()).to.deep.equal({ block: 'block', elem: 'elem' });
    });

    it('should create simple modifier of block from object', () => {
        const entityName = BemEntityName.create({ block: 'block', mod: 'mod' });

        expect(entityName.valueOf()).to.deep.equal({ block: 'block', mod: { name: 'mod', val: true } });
    });

    it('should create modifier of block from object', () => {
        const entityName = BemEntityName.create({ block: 'block', mod: 'mod', val: 'val' });

        expect(entityName.valueOf()).to.deep.equal({ block: 'block', mod: { name: 'mod', val: 'val' } });
    });

    it('should normalize boolean modifier', () => {
        const entityName = BemEntityName.create({ block: 'block', mod: { name: 'mod' } });

        expect(entityName.mod.val).to.be.true;
    });

    it('should save normalized boolean modifier', () => {
        const entityName = BemEntityName.create({ block: 'block', mod: { name: 'mod' } });

        expect(entityName.mod.val).to.be.true;
    });

    it('should support `modName` and `modVal` fields', () => {
        const entityName = BemEntityName.create({ block: 'block', modName: 'mod', modVal: 'val' });

        expect(entityName.mod).to.deep.equal({ name: 'mod', val: 'val' });
    });

    it('should support `modName` field only', () => {
        const entityName = BemEntityName.create({ block: 'block', modName: 'mod' });

        expect(entityName.mod).to.deep.equal({ name: 'mod', val: true });
    });

    it('should use `mod.name` field instead of `modName`', () => {
        const entityName = BemEntityName.create({ block: 'block', mod: { name: 'mod1' }, modName: 'mod2' });

        expect(entityName.mod.name).to.be.equal('mod1');
    });

    it('should use `mod.val` field instead of `modVal`', () => {
        const entityName = BemEntityName.create({ block: 'block', mod: { name: 'm', val: 'v1' }, modVal: 'v2' });

        expect(entityName.mod.val).to.be.equal('v1');
    });

    it('should use `mod.name` and `mod.val` instead of `val`', () => {
        const entityName = BemEntityName.create({ block: 'block', mod: { name: 'm', val: 'v1' }, val: 'v3'});

        expect(entityName.mod.val).to.be.equal('v1');
    });

    it('should use `mod.name` and `mod.val` instead of `modVal` and `val`', () => {
        const entityName = BemEntityName.create({ block: 'block', mod: { name: 'm', val: 'v1' }, modVal: 'v2', val: 'v3'});

        expect(entityName.mod.val).to.be.equal('v1');
    });
});
