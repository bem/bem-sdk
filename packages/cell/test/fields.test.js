const test = require('ava');
const BemEntityName = require('@bem/entity-name');

const BemCell = require('../index');

test('should provide `entity` field', t => {
    const cell = new BemCell({
        entity: new BemEntityName({ block: 'block' })
    });

    t.deepEqual(cell.entity.valueOf(), { block: 'block' });
});

test('should provide `tech` field', t => {
    const cell = new BemCell({
        entity: new BemEntityName({ block: 'block' }),
        tech: 'css'
    });

    t.is(cell.tech, 'css');
});

test('should provide `layer` field', t => {
    const cell = new BemCell({
        entity: new BemEntityName({ block: 'block' }),
        layer: 'desktop'
    });

    t.is(cell.layer, 'desktop');
});
