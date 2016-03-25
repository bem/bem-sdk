'use strict';

const test = require('ava');
const naming = require('../../../index')({ elem: '__', mod: { name: '--', val: '_' } });

test('should detect mod of elem', t => {
    t.true(naming.isElemMod('block__elem--mod_val'));
});

test('should detect boolean mod of elem', t => {
    t.true(naming.isElemMod('block__elem--mod'));
});
