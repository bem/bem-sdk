'use strict';

const test = require('ava');
const naming = require('../../../index')('two-dashes');

test('should detect mod of block', t => {
    t.true(naming.isBlockMod('block--mod_val'));
});

test('should detect boolean mod of block', t => {
    t.true(naming.isBlockMod('block--mod'));
});
