'use strict';

const test = require('ava');
const naming = require('../../../index')('react');
const parse = naming.parse;

test('should not parse not valid string', t => {
    const obj = parse('(*)(*)');

    t.is(obj, undefined);
});

test('should parse block', t => {
    const obj = parse('Block');

    t.is(obj.block, 'Block');
});

test('should parse mod of block', t => {
    t.plan(3);

    const obj = parse('Block_mod_val');

    t.is(obj.block, 'Block');
    t.is(obj.mod && obj.mod.name, 'mod');
    t.is(obj.mod && obj.mod.val, 'val');
});

test('should parse boolean mod of block', t => {
    t.plan(3);

    const obj = parse('block_mod');

    t.is(obj.block, 'block');
    t.is(obj.mod && obj.mod.name, 'mod');

    t.true(obj.mod && obj.mod.val);
});

test('should parse elem', t => {
    t.plan(2);

    const obj = parse('Block-Elem');

    t.is(obj.block, 'Block');
    t.is(obj.elem, 'Elem');
});

test('should parse mod of elem', t => {
    t.plan(4);

    const obj = parse('block-elem_mod_val');

    t.is(obj.block, 'block');
    t.is(obj.elem, 'elem');
    t.is(obj.mod && obj.mod.name, 'mod');
    t.is(obj.mod && obj.mod.val, 'val');
});

test('should parse boolean mod of elem', t => {
    t.plan(4);

    const obj = parse('block-elem_mod');

    t.is(obj.block, 'block');
    t.is(obj.elem, 'elem');
    t.is(obj.mod && obj.mod.name, 'mod');

    t.true(obj.mod && obj.mod.val);
});
