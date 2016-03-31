'use strict';

const test = require('ava');
const naming = require('../../../index')('two-dashes');
const validate = naming.validate;

test('should validate block', t => {
    t.true(validate('block'));
});

test('should validate mod of block', t => {
    t.true(validate('block--mod'));
});

test('should validate elem', t => {
    t.true(validate('block__elem'));
});

test('should validate mod of elem', t => {
    t.true(validate('block__elem--mod'));
});

test('should not validate elem without block', t => {
    t.false(validate('__elem'));
});

test('should not validate mod without block', t => {
    t.false(validate('--mod'));
});

test('should not validate mod of elem without block', t => {
    t.false(validate('__elem--mod'));
});

test('should not validate nested elem', t => {
    t.false(validate('block__elem1__elem2'));
});

test('should not validate multi mod', t => {
    t.false(validate('block--mod__elem--mod'));
});

test('should not validate block name with illegal literals', t => {
    t.false(validate('^--^'));
});

test('should support CamelCase', t => {
    t.true(validate('BlockName'));
});
