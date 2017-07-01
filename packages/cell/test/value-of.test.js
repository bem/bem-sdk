'use strict';

const test = require('ava');
const BemEntityName = require('@bem/sdk.entity-name');

const BemCell = require('../index');

test('should return cell with entity', t => {
    const cell = new BemCell({
        entity: new BemEntityName({ block: 'block' })
    });

    t.deepEqual(cell.valueOf(), { entity: { block: 'block' } });
});

test('should return cell with entity and tech', t => {
    const cell = new BemCell({
        entity: new BemEntityName({ block: 'block' }),
        tech: 'css'
    });

    t.deepEqual(cell.valueOf(), { entity: { block: 'block' }, tech: 'css' });
});

test('should return cell with entity and layer', t => {
    const cell = new BemCell({
        entity: new BemEntityName({ block: 'block' }),
        layer: 'desktop'
    });

    t.deepEqual(cell.valueOf(), { entity: { block: 'block' }, layer: 'desktop' });
});

test('should return cell with entity and tech and layer', t => {
    const cell = new BemCell({
        entity: new BemEntityName({ block: 'block' }),
        tech: 'css',
        layer: 'desktop'
    });

    t.deepEqual(cell.valueOf(), { entity: { block: 'block' }, tech: 'css', layer: 'desktop' });
});
