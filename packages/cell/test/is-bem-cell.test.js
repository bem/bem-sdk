'use strict';

const test = require('ava');
const BemEntityName = require('@bem/entity-name');

const BemCell = require('../index');

test('should check valid entities', t => {
    const cell = new BemCell({
        entity: new BemEntityName({ block: 'block' })
    });

    t.true(BemCell.isBemCell(cell));
});

test('should not pass invalid blocks', t => {
    t.falsy(BemCell.isBemCell({}));
    t.falsy(BemCell.isBemCell([]));
});

test('should not pass null', t => {
    t.falsy(BemCell.isBemCell(null));
});
