'use strict';

const test = require('ava');
const naming = require('../../../lib/bem-naming')({ elem: '__', mod: '--' });

test('should detect elem', t => {
    t.true(naming.isElem('block__elem'));
});
