'use strict';

const test = require('ava');

const BemCell = require('../index');

test('should detect equal cell', t => {
    const cell1 = BemCell.create({ entity: { block: 'button' }, tech: 'css', layer: 'desktop' });
    const cell2 = BemCell.create({ entity: { block: 'button' }, tech: 'css', layer: 'desktop' });

    t.true(cell1.isEqual(cell2))
});

test('should detect that cells are not equal by entity', t => {
    const cell1 = BemCell.create({ entity: { block: 'button' }, tech: 'css', layer: 'desktop' });
    const cell2 = BemCell.create({ entity: { block: 'input' }, tech: 'css', layer: 'desktop' });

    t.false(cell1.isEqual(cell2));
});

test('should detect that cells are not equal with different fields set', t => {
    const cell1 = BemCell.create({ entity: { block: 'button' }, tech: 'css', });
    const cell2 = BemCell.create({ entity: { block: 'button' }, layer: 'desktop' });

    t.false(cell1.isEqual(cell2));
});

test('should detect that full cell are not equal to cell with missing tech', t => {
    const cell1 = BemCell.create({ entity: { block: 'button' }, tech: 'css', layer: 'desktop' });
    const cell2 = BemCell.create({ entity: { block: 'button' }, layer: 'desktop' });

    t.false(cell1.isEqual(cell2));
});

test('should detect that full cell are not equal to cell with missing layer', t => {
    const cell1 = BemCell.create({ entity: { block: 'button' }, tech: 'css', layer: 'desktop' });
    const cell2 = BemCell.create({ entity: { block: 'button' }, tech: 'css' });

    t.false(cell1.isEqual(cell2));
});

test('should detect that cell are not equal to cell with only entity specified', t => {
    const cell1 = BemCell.create({ entity: { block: 'button' }, tech: 'css', layer: 'desktop' });
    const cell2 = BemCell.create({ entity: { block: 'button' } });

    t.false(cell1.isEqual(cell2));
});

test('should detect equal cell without tech and layer', t => {
    const cell1 = BemCell.create({ entity: { block: 'button' } });
    const cell2 = BemCell.create({ entity: { block: 'button' } });

    t.true(cell1.isEqual(cell2));
});

test('should detect that cells are not equal by tech', t => {
    const cell1 = BemCell.create({ entity: { block: 'button' }, tech: 'css', layer: 'desktop' });
    const cell2 = BemCell.create({ entity: { block: 'button' }, tech: 'js', layer: 'desktop' });

    t.false(cell1.isEqual(cell2));
});

test('should detect that cells are not equal by layer', t => {
    const cell1 = BemCell.create({ entity: { block: 'button' }, tech: 'css', layer: 'desktop' });
    const cell2 = BemCell.create({ entity: { block: 'button' }, tech: 'css', layer: 'touch' });

    t.false(cell1.isEqual(cell2));
});
