'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemCell = require('../index');

describe('is-equal', () => {
    it('should detect equal cell', () => {
        const cell1 = BemCell.create({ block: 'button', tech: 'css', layer: 'desktop' });
        const cell2 = BemCell.create({ block: 'button', tech: 'css', layer: 'desktop' });

        expect(cell1.isEqual(cell2)).to.equal(true);
    });

    it('should detect that cells are not equal by entity', () => {
        const cell1 = BemCell.create({ block: 'button', tech: 'css', layer: 'desktop' });
        const cell2 = BemCell.create({ block: 'input', tech: 'css', layer: 'desktop' });

        expect(cell1.isEqual(cell2)).to.equal(false);
    });

    it('should detect that cells are not equal with different fields set', () => {
        const cell1 = BemCell.create({ block: 'button', tech: 'css' });
        const cell2 = BemCell.create({ block: 'button', layer: 'desktop' });

        expect(cell1.isEqual(cell2)).to.equal(false);
    });

    it('should detect that full cell are not equal to cell with missing tech', () => {
        const cell1 = BemCell.create({ block: 'button', tech: 'css', layer: 'desktop' });
        const cell2 = BemCell.create({ block: 'button', layer: 'desktop' });

        expect(cell1.isEqual(cell2)).to.equal(false);
    });

    it('should detect that full cell are not equal to cell with missing layer', () => {
        const cell1 = BemCell.create({ block: 'button' , tech: 'css', layer: 'desktop' });
        const cell2 = BemCell.create({ block: 'button', tech: 'css' });

        expect(cell1.isEqual(cell2)).to.equal(false);
    });

    it('should detect that cell are not equal to cell with only entity specified', () => {
        const cell1 = BemCell.create({ block: 'button' , tech: 'css', layer: 'desktop' });
        const cell2 = BemCell.create({ block: 'button'  });

        expect(cell1.isEqual(cell2)).to.equal(false);
    });

    it('should detect equal cell without tech and layer', () => {
        const cell1 = BemCell.create({ block: 'button'  });
        const cell2 = BemCell.create({ block: 'button'  });

        expect(cell1.isEqual(cell2)).to.equal(true);
    });

    it('should detect that cells are not equal by tech', () => {
        const cell1 = BemCell.create({ block: 'button' , tech: 'css', layer: 'desktop' });
        const cell2 = BemCell.create({ block: 'button' , tech: 'js', layer: 'desktop' });

        expect(cell1.isEqual(cell2)).to.equal(false);
    });

    it('should detect that cells are not equal by layer', () => {
        const cell1 = BemCell.create({ block: 'button' , tech: 'css', layer: 'desktop' });
        const cell2 = BemCell.create({ block: 'button' , tech: 'css', layer: 'touch' });

        expect(cell1.isEqual(cell2)).to.equal(false);
    });
});
