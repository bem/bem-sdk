'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemCell = require('@bem/sdk.cell');
const BemFile = require('..');

describe('create', () => {
    it('should return instance as is if it`s a BemFile', () => {
        const file = new BemFile({ cell: BemCell.create({ block: 'b' }) });

        expect(BemFile.create(file)).to.equal(file);
    });

    it('should return cell with passed entityName', () => {
        const cell = BemCell.create({ block: 'b' });

        expect(BemFile.create(cell).cell).to.equal(cell);
    });

    it('should create BemFile for block from obj', () => {
        const file = BemFile.create({ block: 'b' });

        expect(file).to.be.an.instanceof(BemFile, 'Should be an instance of BemFile');
        expect(file.cell.block).to.equal('b', 'Should create entity with BemCell.create');
    });

    it('should create file for elem from obj', () => {
        const file = BemFile.create({ block: 'b', elem: 'e' });

        expect(file.entity.valueOf()).to.deep.equal({ block: 'b', elem: 'e' });
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
