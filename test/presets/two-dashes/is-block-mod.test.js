'use strict';

const test = require('ava');
const naming = require('../../../index')('two-dashes');
const isBlockMod = naming.isBlockMod;

test('should detect mod of block', t => {
    t.true(isBlockMod('block--mod_val'));
});

test('should detect boolean mod of block', t => {
    t.true(isBlockMod('block--mod'));
});
