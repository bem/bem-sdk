'use strict';

const test = require('ava');

const BemCell = require('@bem/cell');
const stringify = require('../../lib/stringify');

const cell = BemCell.create({ block: 'block' });

test('should throws error if no format given', t => {
    t.throws(() => stringify(cell), 'You must declare target format');
});

test('should throws error if unsupported format given', t => {
    t.throws(() => stringify(cell, { format: 'unsupported' }), 'Specified format isn\'t supported');
});

test('should throws error if unsupported exportType given', t => {
    t.throws(
        () => stringify(cell, { format: 'enb', exportType: 'unsupported' }), 'Specified export type isn\'t supported'
    );
});
