'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const naming = require('..');

describe('defaults.test.js', () => {
    it.skip('should be elem delim by default', () => {
        const instance1 = naming({ delims: { elem: '__' } });
        const instance2 = naming();

        expect(instance1).to.equal(instance2);
    });

    it.skip('should be mod delim by default', () => {
        const instance1 = naming({ delims: { mod: { name: '_' } } });
        const instance2 = naming();

        expect(instance1).to.equal(instance2);
    });

    it.skip('should be mod value delim by default', () => {
        const instance1 = naming({ delims: { mod: { val: '_' } } });
        const instance2 = naming();

        expect(instance1).to.equal(instance2);
    });
});
