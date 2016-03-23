'use strict';

const test = require('ava');
const naming = require('../../../index')({ elem: '__', mod: { name: '--', val: '_' } });

test('should not determine not valid string', t => {
    const type = naming.typeOf('(*)--(*)');

    t.is(type, undefined);
});

test('should determine block', t => {
    const type = naming.typeOf('block');

    t.is(type, 'block');
});

test('should determine mod of block', t => {
    const type = naming.typeOf('block--mod');

    t.is(type, 'blockMod');
});

test('should determine elem', t => {
    const type = naming.typeOf('block__elem');

    t.is(type, 'elem');
});

test('should determine mod of elem', t => {
    const type = naming.typeOf('block__elem--mod');

    t.is(type, 'elemMod');
});
