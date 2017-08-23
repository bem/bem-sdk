'use strict';

const test = require('ava');
const naming = require('@bem/sdk.naming.entity')('two-dashes');
const stringify = naming.stringify;

test('should stringify block', t => {
    const str = stringify({ block: 'block' });

    t.is(str, 'block');
});

test('should stringify modifier of block', t => {
    const str = stringify({
        block: 'block',
        mod: { name: 'mod', val: 'val' }
    });

    t.is(str, 'block--mod_val');
});

test('should stringify simple modifier of block', t => {
    const str = stringify({
        block: 'block',
        mod: 'mod'
    });

    t.is(str, 'block--mod');
});

test('should stringify boolean modifier of block', t => {
    const str = stringify({
        block: 'block',
        mod: { name: 'mod', val: true }
    });

    t.is(str, 'block--mod');
});

test('should stringify block if modifier value is `undefined`', t => {
    const str = stringify({
        block: 'block',
        mod: { name: 'mod', val: undefined }
    });

    t.is(str, 'block');
});

test('should stringify element', t => {
    const str = stringify({
        block: 'block',
        elem: 'elem'
    });

    t.is(str, 'block__elem');
});

test('should stringify simple modifier of element', t => {
    const str = stringify({
        block: 'block',
        elem: 'elem',
        mod: { name: 'mod', val: 'val' }
    });

    t.is(str, 'block__elem--mod_val');
});

test('should stringify boolean modifier of element', t => {
    const str = stringify({
        block: 'block',
        elem: 'elem',
        mod: 'mod'
    });

    t.is(str, 'block__elem--mod');
});

test('should stringify boolean modifier of element', t => {
    const str = stringify({
        block: 'block',
        elem: 'elem',
        mod: { name: 'mod', val: true }
    });

    t.is(str, 'block__elem--mod');
});

test('should stringify element if modifier value is `undefined`', t => {
    const str = stringify({
        block: 'block',
        elem: 'elem',
        mod: { name: 'mod', val: undefined }
    });

    t.is(str, 'block__elem');
});
