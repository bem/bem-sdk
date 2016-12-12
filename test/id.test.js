const test = require('ava');
const BemEntityName = require('@bem/entity-name');

const BemCell = require('../index');

test('should provide `id` field', t => {
    const cell = new BemCell({
        entity: new BemEntityName({ block: 'block' }),
        layer: 'desktop',
        tech: 'css'
    });

    t.is(cell.id, 'block@desktop.css');
});

test('should provide `id` field for cell with entity `field` only', t => {
    const cell = new BemCell({
        entity: new BemEntityName({ block: 'block' })
    });

    t.is(cell.id, 'block');
});

test('should provide `id` field for cell with `tech` field', t => {
    const cell = new BemCell({
        entity: new BemEntityName({ block: 'block' }),
        tech: 'css'
    });

    t.is(cell.id, 'block.css');
});

test('should provide `id` field for cell with `layer` field', t => {
    const cell = new BemCell({
        entity: new BemEntityName({ block: 'block' }),
        layer: 'desktop',
    });

    t.is(cell.id, 'block@desktop');
});

test('should cache `id` field', t => {
    const cell = new BemCell({
        entity: new BemEntityName({ block: 'block' }),
        layer: 'desktop',
        tech: 'css'
    });
    const id = cell.id;

    cell._tech = 'js';
    cell._layer = 'common';

    t.is(cell.id, id);
});
