'use strict';

const test = require('ava');
const naming = require('../../../index')({ elem: '__', mod: '--' });

test('should detect mod of elem', t => {
    t.true(naming.isElemMod('block__elem--mod'));
});
