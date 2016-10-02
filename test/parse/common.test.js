'use strict';

const test = require('ava');
const parse = require('../..').parse;

test('should throw if undefined', t => {
    t.throws(() => parse(), /Bemdecl must be String or Object/);
});

test('should throw if unsupported', t => {
    t.throws(() => parse('({ version: \'unknown\', components: [] })'), /Unknown BEMDECL format/);
});

test('should throw if unsupported in object', t => {
    t.throws(() => parse({ version: 'unknown', components: [] }), /Unknown BEMDECL format/);
});
