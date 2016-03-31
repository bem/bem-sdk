'use strict';

const test = require('ava');
const naming = require('../../../index')('origin');
const stringify = naming.stringify;

test('should stringify block', t => {
    const str = stringify({ block: 'block' });

    t.is(str, 'block');
});

test('should stringify mod of block', t => {
    const str = stringify({
        block: 'block',
        modName: 'mod',
        modVal: 'val'
    });

    t.is(str, 'block_mod_val');
});

test('should stringify boolean mod of block', t => {
    const str = stringify({
        block: 'block',
        modName: 'mod'
    });

    t.is(str, 'block_mod');
});

test('should stringify boolean mod of block by strict notation', t => {
    const str = stringify({
        block: 'block',
        modName: 'mod',
        modVal: true
    });

    t.is(str, 'block_mod');
});

test('should stringify block if `modVal` filed is `undefined`', t => {
    const str = stringify({
        block: 'block',
        modName: 'mod',
        modVal: undefined
    });

    t.is(str, 'block');
});

test('should stringify elem', t => {
    const str = stringify({
        block: 'block',
        elem: 'elem'
    });

    t.is(str, 'block__elem');
});

test('should stringify mod of elem', t => {
    const str = stringify({
        block: 'block',
        elem: 'elem',
        modName: 'mod',
        modVal: 'val'
    });

    t.is(str, 'block__elem_mod_val');
});

test('should stringify boolean mod of elem', t => {
    const str = stringify({
        block: 'block',
        elem: 'elem',
        modName: 'mod'
    });

    t.is(str, 'block__elem_mod');
});

test('should stringify boolean mod of elem by strict notation', t => {
    const str = stringify({
        block: 'block',
        elem: 'elem',
        modName: 'mod',
        modVal: true
    });

    t.is(str, 'block__elem_mod');
});

test('should stringify elem if `modVal` filed is `undefined`', t => {
    const str = stringify({
        block: 'block',
        elem: 'elem',
        modName: 'mod',
        modVal: undefined
    });

    t.is(str, 'block__elem');
});
