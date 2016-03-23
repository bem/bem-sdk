'use strict';

const test = require('ava');
const naming = require('../../../index')({ elem: '__', mod: { name: '--', val: '_' } });

test('should detect mod of block', t => {
    t.true(naming.isBlockMod('block--mod_val'));
});

test('should detect boolean mod of block', t => {
    t.true(naming.isBlockMod('block--mod'));
});
