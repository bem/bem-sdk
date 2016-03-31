'use strict';

const test = require('ava');
const naming = require('../../../index')('origin');
const typeOf = naming.typeOf;

test('should not determine not valid string', t => {
    const type = typeOf('(*)_(*)');

    t.is(type, undefined);
});

test('should determine block', t => {
    const type = typeOf('block');

    t.is(type, 'block');
});

test('should determine mod of block', t => {
    const type = typeOf('block_mod_val');

    t.is(type, 'blockMod');
});

test('should determine boolean mod of block', t => {
    const type = typeOf('block_mod');

    t.is(type, 'blockMod');
});

test('should determine elem', t => {
    const type = typeOf('block__elem');

    t.is(type, 'elem');
});

test('should determine mod of elem', t => {
    const type = typeOf('block__elem_mod_val');

    t.is(type, 'elemMod');
});

test('should determine boolean mod of elem', t => {
    const type = typeOf('block__elem_mod');

    t.is(type, 'elemMod');
});
