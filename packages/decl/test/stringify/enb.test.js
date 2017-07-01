'use strict';

const test = require('ava');
const BemCell = require('@bem/cell');
const JSON5 = require('json5');

const stringify = require('../../lib/stringify');

const obj = {
    format: 'enb',
    decl: [{ block: 'block', elem: 'elem', mod: 'mod', val: 'val' }]
};
const cell = BemCell.create({ block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' });

test('should throws error if no format given', t => {
    t.throws(() => stringify(cell),
        'You must declare target format'
    );
});

test('should stringify enb declaration with commonJS', t => {
    t.is(
        stringify(cell, { format: 'enb', exportType: 'commonjs' }),
        `module.exports = ${JSON5.stringify(obj, null, 4)};\n`
    );
});

test('should stringify enb declaration with es6', t => {
    t.is(
        stringify(cell, { format: 'enb', exportType: 'es6' }),
        `export default ${JSON5.stringify(obj, null, 4)};\n`
    );
});

test('should stringify enb declaration with es2105', t => {
    t.is(
        stringify(cell, { format: 'enb', exportType: 'es2015' }),
        `export default ${JSON5.stringify(obj, null, 4)};\n`
    );
});

test('should stringify enb declaration with JSON', t => {
    t.is(
        stringify(cell, { format: 'enb', exportType: 'json' }),
        JSON.stringify(obj, null, 4)
    );
});

test('should stringify enb declaration with JSON5', t => {
    t.is(
        stringify(cell, { format: 'enb', exportType: 'json5' }),
        JSON5.stringify(obj, null, 4)
    );
});

test('should stringify enb declaration with JSON if no exportType given', t => {
    t.is(
        stringify(cell, { format: 'enb' }),
        JSON.stringify(obj, null, 4)
    );
});
