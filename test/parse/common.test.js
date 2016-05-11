'use strict';

const test = require('ava');
const parse = require('../..').parse;

test('should throw if undefined', t => {
    t.throws(() => parse(), /Unknown BEMDECL format/);
});

test('should throw if unsupported', t => {
    t.throws(() => parse({ version: 'unknown', components: [] }), /Unknown BEMDECL format/);
});
