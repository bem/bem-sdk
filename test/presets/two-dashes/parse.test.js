'use strict';

const test = require('ava');
const naming = require('../../../index')('two-dashes');
const parse = naming.parse;

test('should not parse not valid string', t => {
    const obj = parse('(*)--(*)');

    t.is(obj, undefined);
});

test('should have one filed if parse block', t => {
    const obj = parse('block');

    t.is(Object.keys(obj).length, 1);
});

test('should have three filed if parse mod of block', t => {
    const obj = parse('block--mod_val');

    t.is(Object.keys(obj).length, 3);
});

test('should have three filed if parse boolean mod of block', t => {
    const obj = parse('block--mod');

    t.is(Object.keys(obj).length, 3);
});

test('should have two filed if parse elem of block', t => {
    const obj = parse('block__elem');

    t.is(Object.keys(obj).length, 2);
});

test('should have four filed if parse mod of elem', t => {
    const obj = parse('block__elem--mod_val');

    t.is(Object.keys(obj).length, 4);
});

test('should have four filed if parse boolean mod of elem', t => {
    const obj = parse('block__elem--mod');

    t.is(Object.keys(obj).length, 4);
});

test('should parse block', t => {
    const obj = parse('block');

    t.is(obj.block, 'block');
});

test('should parse mod of block', t => {
    t.plan(3);

    const obj = parse('block--mod_val');

    t.is(obj.block, 'block');
    t.is(obj.modName, 'mod');
    t.is(obj.modVal, 'val');
});

test('should parse boolean mod of block', t => {
    t.plan(3);

    const obj = parse('block--mod');

    t.is(obj.block, 'block');
    t.is(obj.modName, 'mod');

    t.true(obj.modVal);
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
    t.is(obj.modName, 'mod');
    t.is(obj.modVal, 'val');
});

test('should parse boolean mod of elem', t => {
    t.plan(4);

    const obj = parse('block__elem--mod');

    t.is(obj.block, 'block');
    t.is(obj.elem, 'elem');
    t.is(obj.modName, 'mod');

    t.true(obj.modVal);
});
