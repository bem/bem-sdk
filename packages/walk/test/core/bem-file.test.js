'use strict';

const test = require('ava');

const BemEntityName = require('@bem/entity-name');
const BemCell = require('@bem/cell');

const BemFile = require('../../lib/bem-file');

test('should provide classic bem-file fields', t => {
    const cell = new BemCell({
        entity: new BemEntityName({ block: 'b', elem: 'e' }),
        tech: 'css',
        layer: 'bem-components/desktop'
    });
    const path = 'bem-components/desktop.blocks/b/__e/b__e.css';
    const file = new BemFile(cell, path);

    t.is(file.cell, cell);
    t.is(file.entity, cell.entity);
    t.is(file.tech, cell.tech);
    t.is(file.level, cell.layer);
    t.is(file.layer, cell.layer);
    t.is(file.path, path);
});
