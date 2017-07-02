'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemEntityName = require('@bem/sdk.entity-name');

const BemCell = require('../index');

describe('create', () => {
    it('should return instance as is if it`s a BemCell', () => {
        const cell = new BemCell({ entity: new BemEntityName({ block: 'b' }) });

        expect(BemCell.create(cell)).to.equal(cell);
    });

    it('should return cell with passed entityName', () => {
        const entity = new BemEntityName({ block: 'b' });

        expect(BemCell.create(entity).entity).to.equal(entity);
    });

    it('should create BemCell for block from obj', () => {
        const cell = BemCell.create({ block: 'b' });

        expect(cell).to.be.an.instanceof(BemCell, 'Should be an instance of BemCell');
        expect(cell.entity.block).to.equal('b', 'Should create entity with BemEntityName.create');
    });

    it('should create cell for elem from obj', () => {
        const cell = BemCell.create({ block: 'b', elem: 'e' });

        expect(cell.entity.valueOf()).to.deep.equal({ block: 'b', elem: 'e' });
    });

    it('should create cell with tech', () => {
        const cell = BemCell.create({ block: 'block', tech: 'css' });

        expect(cell.tech).to.equal('css');
    });

    it('should create cell with layer', () => {
        const cell = BemCell.create({ block: 'block', layer: 'desktop' });

        expect(cell.layer).to.equal('desktop');
    });

    it('should create cell with layer', () => {
        const cell = BemCell.create({ block: 'block', tech: 'css', layer: 'desktop' });

        expect(cell.tech).to.equal('css');
        expect(cell.layer).to.equal('desktop');
    });

    it('should create BemCell for block from obj', () => {
        const cell = BemCell.create({ block: 'b', elem: 'e', mod: 'm', val: 'v', tech: 't', layer: 'l' });

        expect(cell.valueOf()).to.deep.equal({
            entity: { block: 'b', elem: 'e', mod: { name: 'm', val: 'v' } },
            tech: 't',
            layer: 'l'
        });
    });

    it('should create BemCell for entity with tech and layer from obj', () => {
        const cell = BemCell.create({ entity: { block: 'b', mod: 'm', val: 'v' }, tech: 't', layer: 'l' });

        expect(cell.valueOf()).to.deep.equal({
            entity: { block: 'b', mod: { name: 'm', val: 'v' } },
            tech: 't',
            layer: 'l'
        });
    });
});
