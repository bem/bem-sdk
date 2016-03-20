'use strict';

const test = require('ava');
const naming = require('../../../index')({ elem: '__', mod: '--' });

test('should detect mod of block', t => {
    t.true(naming.isBlockMod('block--mod'));
});
