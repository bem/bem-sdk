'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemEntityName = require('../..');

describe('constructor/normalize.test.js', () => {    it('should normalize simple modifier', () => {
        const entity = new BemEntityName({ block: 'block', mod: 'mod' });

        expect(entity.mod.val).to.be.true;
    });

    it('should normalize boolean modifier', () => {
        const entity = new BemEntityName({ block: 'block', mod: { name: 'mod' } });

        expect(entity.mod.val).to.be.true;
    });

    it('should save normalized boolean modifier', () => {
        const entity = new BemEntityName({ block: 'block', mod: { name: 'mod', val: true } });

        expect(entity.mod.val).to.be.true;
    });

    it('should support `modName` and `modVal` fields', () => {
        const entity = new BemEntityName({ block: 'block', modName: 'mod', modVal: 'val' });

        expect(entity.mod).to.deep.equal({ name: 'mod', val: 'val' });
    });

    it('should support `modName` field only', () => {
        const entity = new BemEntityName({ block: 'block', modName: 'mod' });

        expect(entity.mod).to.deep.equal({ name: 'mod', val: true });
    });

    it('should use `mod.name` field instead of `modName`', () => {
        const entity = new BemEntityName({ block: 'block', mod: { name: 'mod1' }, modName: 'mod2' });

        expect(entity.mod.name).to.equal('mod1');
    });

    it('should use `mod.val` field instead of `modVal`', () => {
        const entity = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val1' }, modVal: 'val2' });

        expect(entity.mod.val).to.equal('val1');
    });

    it('should return the same instance for same class', () => {
        const entity = new BemEntityName({ block: 'block', mod: 'mod' });
        const entity2 = new BemEntityName(entity);

        expect(entity).to.equal(entity2);
    });

    it('should not use modName field for BemEntityName instances of another versions', () => {
        const entity = new BemEntityName({ block: 'block', modName: 'mod', __isBemEntityName__: true });

        expect(entity.mod).to.equal(undefined);
    });
});