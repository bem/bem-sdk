'use strict';

const test = require('ava');
const naming = require('../lib/bem-naming');

test('should not determine undefined', t => {
    const type = naming.typeOf(undefined);

    t.is(type, undefined);
});

test('should not determine empty string', t => {
    const type = naming.typeOf('');

    t.is(type, undefined);
});

test('should not determine empty object', t => {
    const type = naming.typeOf({});

    t.is(type, undefined);
});

test('should not determine not valid object', t => {
    const type = naming.typeOf({ bem: 'hello' });

    t.is(type, undefined);
});

test('should not determine object without `block` field', t => {
    const type = naming.typeOf({ elem: 'elem' });

    t.is(type, undefined);
});

test('should not determine mod of block if `modVal` field equal `false`', t => {
    const type = naming.typeOf({ block: 'block', modName: 'mod', modVal: false });

    t.is(type, undefined);
});

test('should not determine mod of elem if `modVal` field equal `false`', t => {
    const type = naming.typeOf({ block: 'block', elem: 'elem', modName: 'mod', modVal: false });

    t.is(type, undefined);
});

test('should determine block', t => {
    const type = naming.typeOf({ block: 'block' });

    t.is(type, 'block');
});

test('should determine mod of block', t => {
    const type = naming.typeOf({ block: 'block', modName: 'mod', modVal: 'val' });

    t.is(type, 'blockMod');
});

test('should determine boolean mod of block', t => {
    const type = naming.typeOf({ block: 'block', modName: 'mod', modVal: true });

    t.is(type, 'blockMod');
});

test('should determine elem', t => {
    const type = naming.typeOf({ block: 'block', elem: 'elem' });

    t.is(type, 'elem');
});

test('should determine mod of elem', t => {
    const type = naming.typeOf({ block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' });

    t.is(type, 'elemMod');
});

test('should determine boolean mod of elem', t => {
    const type = naming.typeOf({ block: 'block', elem: 'elem', modName: 'mod', modVal: true });

    t.is(type, 'elemMod');
});
