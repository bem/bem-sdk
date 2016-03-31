'use strict';

const test = require('ava');
const naming = require('../../../index')('two-dashes');
const typeOf = naming.typeOf;

test('should not determine not valid string', t => {
    const type = typeOf('(*)--(*)');

    t.is(type, undefined);
});

test('should determine block', t => {
    const type = typeOf('block');

    t.is(type, 'block');
});

test('should determine mod of block', t => {
    const type = typeOf('block--mod');

    t.is(type, 'blockMod');
});

test('should determine elem', t => {
    const type = typeOf('block__elem');

    t.is(type, 'elem');
});

test('should determine mod of elem', t => {
    const type = typeOf('block__elem--mod');

    t.is(type, 'elemMod');
});
