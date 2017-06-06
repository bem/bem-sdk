import test from 'ava';

import EntityTypeError from '../lib/entity-type-error';

test('should create type error', t => {
    const error = new EntityTypeError();

    t.is(error.message, 'the  `undefined` is not valid BEM entity');
});

test('should create type error with number', t => {
    const error = new EntityTypeError(42);

    t.is(error.message, 'the number `42` is not valid BEM entity');
});

test('should create type error with string', t => {
    const error = new EntityTypeError('block');

    t.is(error.message, 'the string `\'block\'` is not valid BEM entity');
});

test('should create type error with empty object', t => {
    const error = new EntityTypeError({});

    t.is(error.message, 'the object `{}` is not valid BEM entity');
});

test('should create type error with object', t => {
    const error = new EntityTypeError({ key: 'val' });

    t.is(error.message, "the object `{ key: 'val' }` is not valid BEM entity");
});

test('should create type error with deep object', t => {
    const error = new EntityTypeError({ a: { b: { c: 'd' } } });

    t.is(error.message, 'the object `{ a: { b: [Object] } }` is not valid BEM entity');
});

test('should create type error with reason', t => {
    const error = new EntityTypeError({ elem: 'elem' }, 'the field `block` is undefined');

    t.is(error.message, "the object `{ elem: 'elem' }` is not valid BEM entity, the field `block` is undefined");
});
