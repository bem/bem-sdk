'use strict';

const test = require('ava');

const BemEntityName = require('@bem/entity-name');

const BemCell = require('../index');

test('should return object as is if it`s a BemCell', t => {
    const cell = new BemCell({ entity: new BemEntityName({ block: 'b' }) });

    t.is(BemCell.create(cell), cell);
});

test('should return cell with passed entityName', t => {
    const entity = new BemEntityName({ block: 'b' });

    t.is(BemCell.create(entity).entity, entity);
});

test('should create BemCell for block from obj', t => {
    const cell = BemCell.create({ block: 'b' });

    t.pass(cell instanceof BemCell, 'Should be an instance of BemCell');
    t.is(cell.entity.block, 'b', 'Should create entity with BemEntityName.create');
});

test('should create cell for elem from obj', t => {
    const cell = BemCell.create({ block: 'b', elem: 'e' });

    t.deepEqual(cell.entity.valueOf(), { block: 'b', elem: 'e' });
});

test('should create cell with tech', t => {
    const cell = BemCell.create({ block: 'block', tech: 'css' });

    t.is(cell.tech, 'css');
});

test('should create cell with layer', t => {
    const cell = BemCell.create({ block: 'block', layer: 'desktop' });

    t.is(cell.layer, 'desktop');
});

test('should create cell with layer', t => {
    const cell = BemCell.create({ block: 'block', tech: 'css', layer: 'desktop' });

    t.is(cell.tech, 'css');
    t.is(cell.layer, 'desktop');
});

test('should create BemCell for block from obj', t => {
    const cell = BemCell.create({ block: 'b', elem: 'e', mod: 'm', val: 'v', tech: 't', layer: 'l' });

    t.deepEqual(cell.valueOf(), {
        entity: { block: 'b', elem: 'e', mod: { name: 'm', val: 'v' } },
        tech: 't',
        layer: 'l'
    });
});

test('should create BemCell for entity with tech and layer from obj', t => {
    const cell = BemCell.create({ entity: { block: 'b', mod: 'm', val: 'v' }, tech: 't', layer: 'l' });

    t.deepEqual(cell.valueOf(), {
        entity: { block: 'b', mod: { name: 'm', val: 'v' } },
        tech: 't',
        layer: 'l'
    });
});
