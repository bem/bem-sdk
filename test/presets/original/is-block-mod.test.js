'use strict';

const test = require('ava');
const naming = require('../../../index')('origin');
const isBlockMod = naming.isBlockMod;

test('should detect mod of block', t => {
    t.true(isBlockMod('block_mod_val'));
});

test('should detect boolean mod of block', t => {
    t.true(isBlockMod('block_mod'));
});
