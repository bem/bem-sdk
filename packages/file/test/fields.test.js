'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemFile = require('..');

describe('fields', () => {
    it('should provide `cell` field', () => {
        const file = new BemFile({
            cell: { block: 'block', tech: 'css' }
        });

        expect(file.cell.valueOf()).to.deep.equal({ entity: { block: 'block' }, tech: 'css' });
    });

    it('should provide `entity` field', () => {
        const file = new BemFile({
            cell: { block: 'block', tech: 'css' }
        });

        expect(file.entity.valueOf()).to.deep.equal({ block: 'block' });
    });

    it('should provide `tech` field', () => {
        const file = new BemFile({
            cell: { block: 'block', tech: 'css' }
        });

        expect(file.tech).to.equal('css');
    });

    it('should provide `layer` field', () => {
        const file = new BemFile({
            cell: { block: 'block', layer: 'desktop' }
        });

        expect(file.layer).to.equal('desktop');
    });
});
