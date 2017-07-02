'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemEntityName = require('@bem/sdk.entity-name');

const BemCell = require('../index');

const cell = new BemCell({ entity: new BemEntityName({ block: 'b', elem: 'e', mod: { name: 'm', val: 'v' } }) });
const modLessCell = new BemCell({ entity: new BemEntityName({ block: 'b' }) });

describe('legacy', () => {
    it('should return block field from entity', () => {
        expect(cell.block).to.equal(cell.entity.block);
    });

    it('should return elem field from entity', () => {
        expect(cell.elem).to.equal(cell.entity.elem);
    });

    it('should return modName field from entity', () => {
        expect(cell.modName).to.equal(cell.entity.modName);
    });

    it('should return modVal field from entity', () => {
        expect(cell.modVal).to.equal(cell.entity.modVal);
    });

    it('should return mod field from entity', () => {
        expect(cell.mod).to.deep.equal(cell.entity.mod);
    });

    it('should return undefined for modName field from entity', () => {
        expect(modLessCell.modName).to.equal(undefined);
    });

    it('should return undefined for modVal field from entity', () => {
        expect(modLessCell.modVal).to.equal(undefined);
    });

    it('should return undefined for mod field from entity', () => {
        expect(modLessCell.mod).to.equal(undefined);
    });
});
