'use strict';

const test = require('ava');
const naming = require('../../../index')('two-dashes');
const isElemMod = naming.isElemMod;

test('should detect mod of elem', t => {
    t.true(isElemMod('block__elem--mod_val'));
});

test('should detect boolean mod of elem', t => {
    t.true(isElemMod('block__elem--mod'));
});
