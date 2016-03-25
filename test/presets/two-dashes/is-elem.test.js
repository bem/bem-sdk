'use strict';

const test = require('ava');
const naming = require('../../../index')({ elem: '__', mod: { name: '--', val: '_' } });

test('should detect elem', t => {
    t.true(naming.isElem('block__elem'));
});
