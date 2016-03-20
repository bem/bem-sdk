'use strict';

const test = require('ava');
const naming = require('../../../lib/bem-naming')({ elem: '__', mod: '--' });

test('should validate block', t => {
    t.true(naming.validate('block'));
});

test('should validate mod of block', t => {
    t.true(naming.validate('block--mod'));
});

test('should validate elem', t => {
    t.true(naming.validate('block__elem'));
});

test('should validate mod of elem', t => {
    t.true(naming.validate('block__elem--mod'));
});

test('should not validate elem without block', t => {
    t.false(naming.validate('__elem'));
});

test('should not validate mod without block', t => {
    t.false(naming.validate('--mod'));
});

test('should not validate mod of elem without block', t => {
    t.false(naming.validate('__elem--mod'));
});

test('should not validate nested elem', t => {
    t.false(naming.validate('block__elem1__elem2'));
});

test('should not validate multi mod', t => {
    t.false(naming.validate('block--mod__elem--mod'));
});

test('should not validate block name with illegal literals', t => {
    t.false(naming.validate('^--^'));
});

test('should support CamelCase', t => {
    t.true(naming.validate('BlockName'));
});
