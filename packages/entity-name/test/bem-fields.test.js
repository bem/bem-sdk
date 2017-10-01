'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemEntityName = require('..');

describe('bem-fields', () => {
    it('should provide `block` field', () => {
        const entityName = new BemEntityName({ block: 'block' });

        expect(entityName.block).to.equal('block');
    });

    it('should provide `elem` field', () => {
        const entityName = new BemEntityName({ block: 'block', elem: 'elem' });

        expect(entityName.elem).to.equal('elem');
    });

    it('should provide `mod` field', () => {
        const entityName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val' } });

        expect(entityName.mod).to.deep.equal({ name: 'mod', val: 'val' });
    });

    it('should provide `modName` field', () => {
        const entityName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val' } });

        expect(entityName.modName).to.equal('mod');
    });

    it('should provide `modVal` field', () => {
        const entityName = new BemEntityName({ block: 'block', mod: { name: 'mod', val: 'val' } });

        expect(entityName.modVal).to.equal('val');
    });

    it('should return `undefined` if entity is not element', () => {
        const entityName = new BemEntityName({ block: 'block' });

        expect(entityName.elem).to.equal(undefined);
    });

    it('should return `undefined` if entity is not modifier', () => {
        const entityName = new BemEntityName({ block: 'block' });

        expect(entityName.mod).to.equal(undefined);
    });

    it('should return `undefined` in `modName` property if entity is not modifier', () => {
        const entityName = new BemEntityName({ block: 'block' });

        expect(entityName.mod).to.equal(undefined);
    });

    it('should return `undefined` in `modVal` property if entity is not modifier', () => {
        const entityName = new BemEntityName({ block: 'block' });

        expect(entityName.mod).to.equal(undefined);
    });
});
