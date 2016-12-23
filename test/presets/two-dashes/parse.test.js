'use strict';

const test = require('ava');
const naming = require('../../../index')('two-dashes');
const parse = naming.parse;

test('should not parse not valid string', t => {
    const obj = parse('(*)--(*)');

    t.is(obj, undefined);
});

test('should parse block', t => {
    const obj = parse('block');

    t.is(obj.block, 'block');
});

test('should parse mod of block', t => {
    t.plan(3);

    const obj = parse('block--mod_val');

    t.is(obj.block, 'block');
    t.is(obj.mod && obj.mod.name, 'mod');
    t.is(obj.mod && obj.mod.val, 'val');
});

test('should parse boolean mod of block', t => {
    t.plan(3);

    const obj = parse('block--mod');

    t.is(obj.block, 'block');
    t.is(obj.mod && obj.mod.name, 'mod');

    t.true(obj.mod && obj.mod.val);
});

test('should parse elem', t => {
    t.plan(2);

    const obj = parse('block__elem');

    t.is(obj.block, 'block');
    t.is(obj.elem, 'elem');
});

test('should parse mod of elem', t => {
    t.plan(4);

    const obj = parse('block__elem--mod_val');

    t.is(obj.block, 'block');
    t.is(obj.elem, 'elem');
    t.is(obj.mod && obj.mod.name, 'mod');
    t.is(obj.mod && obj.mod.val, 'val');
});

test('should parse boolean mod of elem', t => {
    t.plan(4);

    const obj = parse('block__elem--mod');

    t.is(obj.block, 'block');
    t.is(obj.elem, 'elem');
    t.is(obj.mod && obj.mod.name, 'mod');

    t.true(obj.mod && obj.mod.val);
});
