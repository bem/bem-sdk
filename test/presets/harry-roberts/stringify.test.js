'use strict';

const test = require('ava');
const naming = require('../../../lib/bem-naming')({ elem: '__', mod: '--' });

test('should stringify block', t => {
    const str = naming.stringify({ block: 'block' });

    t.is(str, 'block');
});

test('should stringify mod of block', t => {
    const str = naming.stringify({
        block: 'block',
        modName: 'mod'
    });

    t.is(str, 'block--mod');
});

test('should stringify mod of block by strict notation', t => {
    const str = naming.stringify({
        block: 'block',
        modName: 'mod',
        modVal: true
    });

    t.is(str, 'block--mod');
});

test('should stringify block if `modVal` filed is `undefined`', t => {
    const str = naming.stringify({
        block: 'block',
        modName: 'mod',
        modVal: undefined
    });

    t.is(str, 'block');
});

test('should stringify elem', t => {
    const str = naming.stringify({
        block: 'block',
        elem: 'elem'
    });

    t.is(str, 'block__elem');
});

test('should stringify mod of elem', t => {
    const str = naming.stringify({
        block: 'block',
        elem: 'elem',
        modName: 'mod',
        modVal: true
    });

    t.is(str, 'block__elem--mod');
});

test('should stringify mod of elem by strict notation', t => {
    const str = naming.stringify({
        block: 'block',
        elem: 'elem',
        modName: 'mod',
        modVal: true
    });

    t.is(str, 'block__elem--mod');
});

test('should stringify elem if `modVal` filed is `undefined`', t => {
    const str = naming.stringify({
        block: 'block',
        elem: 'elem',
        modName: 'mod',
        modVal: undefined
    });

    t.is(str, 'block__elem');
});
