'use strict';

const test = require('ava');
const naming = require('../../../lib/bem-naming');

test('should detect mod of elem', t => {
    t.true(naming.isElemMod('block__elem_mod_val'));
});

test('should detect boolean mod of elem', t => {
    t.true(naming.isElemMod('block__elem_mod'));
});
