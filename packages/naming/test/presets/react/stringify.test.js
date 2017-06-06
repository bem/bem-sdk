'use strict';

const test = require('ava');
const naming = require('../../../index')('react');
const stringify = naming.stringify;

test('should stringify block', t => {
    const str = stringify({ block: 'Block' });

    t.is(str, 'Block');
});

test('should stringify modifier of block', t => {
    const str = stringify({
        block: 'Block',
        mod: { name: 'mod', val: 'val' }
    });

    t.is(str, 'Block_mod_val');
});

test('should stringify simple modifier of block', t => {
    const str = stringify({
        block: 'block',
        mod: 'mod'
    });

    t.is(str, 'block_mod');
});

test('should stringify boolean modifier of block', t => {
    const str = stringify({
        block: 'block',
        mod: { name: 'mod', val: true },
    });

    t.is(str, 'block_mod');
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
        block: 'Block',
        elem: 'Elem'
    });

    t.is(str, 'Block-Elem');
});

test('should stringify modifier of element', t => {
    const str = stringify({
        block: 'block',
        elem: 'elem',
        mod: { name: 'mod', val: 'val' }
    });

    t.is(str, 'block-elem_mod_val');
});

test('should stringify simple modifier of element', t => {
    const str = stringify({
        block: 'block',
        elem: 'elem',
        mod: 'mod'
    });

    t.is(str, 'block-elem_mod');
});

test('should stringify boolean modifier of element', t => {
    const str = stringify({
        block: 'block',
        elem: 'elem',
        mod: { name: 'mod', val: true }
    });

    t.is(str, 'block-elem_mod');
});

test('should stringify element if modifier value is `undefined`', t => {
    const str = stringify({
        block: 'block',
        elem: 'elem',
        mod: { name: 'mod', val: undefined }
    });

    t.is(str, 'block-elem');
});
