'use strict';

const test = require('ava');
const naming = require('../../../index');

test('should detect mod of block', t => {
    t.true(naming.isBlockMod('block_mod_val'));
});

test('should detect boolean mod of block', t => {
    t.true(naming.isBlockMod('block_mod'));
});
