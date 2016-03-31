'use strict';

const test = require('ava');
const naming = require('../../../index')('origin');
const validate = naming.validate;

test('should validate block', t => {
    t.true(validate('block'));
});

test('should validate mod of block', t => {
    t.true(validate('block_mod_val'));
});

test('should validate boolean mod of block', t => {
    t.true(validate('block_mod'));
});

test('should validate elem', t => {
    t.true(validate('block__elem'));
});

test('should validate mod of elem', t => {
    t.true(validate('block__elem_mod_value'));
});

test('should validate boolean mod of elem', t => {
    t.true(validate('block__elem_mod'));
});

test('should not validate elem without block', t => {
    t.false(validate('__elem'));
});

test('should not validate boolean mod without block', t => {
    t.false(validate('_mod'));
});

test('should not validate mod without block', t => {
    t.false(validate('_mod_val'));
});

test('should not validate mod of elem without block', t => {
    t.false(validate('__elem_mod_val'));
});

test('should not validate boolean mod of elem without block', t => {
    t.false(validate('__elem_mod'));
});

test('should not validate nested elem', t => {
    t.false(validate('block__elem1__elem2'));
});

test('should not validate multi mod', t => {
    t.false(validate('block_mod_val__elem_mod_val'));
});

test('should not validate block name with illegal literals', t => {
    t.false(validate('^_^'));
});

test('should support CamelCase', t => {
    t.true(validate('BlockName'));
});
