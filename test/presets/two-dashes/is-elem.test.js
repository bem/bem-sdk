'use strict';

const test = require('ava');
const naming = require('../../../index')('two-dashes');
const isElem = naming.isElem;

test('should detect elem', t => {
    t.true(isElem('block__elem'));
});
