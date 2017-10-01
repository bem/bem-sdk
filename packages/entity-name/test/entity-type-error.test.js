'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const EntityTypeError = require('../lib/entity-type-error');

describe('entity-type-error', () => {
    it('should create type error', () => {
        const error = new EntityTypeError();

        expect(error.message).to.equal('the  `undefined` is not valid BEM entity');
    });

    it('should create type error with number', () => {
        const error = new EntityTypeError(42);

        expect(error.message).to.equal('the number `42` is not valid BEM entity');
    });

    it('should create type error with string', () => {
        const error = new EntityTypeError('block');

        expect(error.message).to.equal('the string `\'block\'` is not valid BEM entity');
    });

    it('should create type error with empty object', () => {
        const error = new EntityTypeError({});

        expect(error.message).to.equal('the object `{}` is not valid BEM entity');
    });

    it('should create type error with object', () => {
        const error = new EntityTypeError({ key: 'val' });

        expect(error.message).to.equal('the object `{ key: \'val\' }` is not valid BEM entity');
    });

    it('should create type error with deep object', () => {
        const error = new EntityTypeError({ a: { b: { c: 'd' } } });

        expect(error.message).to.equal('the object `{ a: { b: [Object] } }` is not valid BEM entity');
    });

    it('should create type error with reason', () => {
        const error = new EntityTypeError({ elem: 'elem' }, 'the field `block` is undefined');

        expect(error.message).to.equal('the object `{ elem: \'elem\' }` is not valid BEM entity, the field `block` is undefined');
    });
});
