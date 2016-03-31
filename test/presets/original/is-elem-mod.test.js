'use strict';

const test = require('ava');
const naming = require('../../../index')('origin');
const isElemMod = naming.isElemMod;

test('should detect mod of elem', t => {
    t.true(isElemMod('block__elem_mod_val'));
});

test('should detect boolean mod of elem', t => {
    t.true(isElemMod('block__elem_mod'));
});
