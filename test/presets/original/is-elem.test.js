'use strict';

const test = require('ava');
const naming = require('../../../index');

test('should detect elem', t => {
    t.true(naming.isElem('block__elem'));
});
