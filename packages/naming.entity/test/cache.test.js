'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const naming = require('../index');

describe('cache.test.js', () => {
    it('should cache instance of original naming', () => {
        const instance1 = naming();
        const instance2 = naming();

        expect(instance1).to.equal(instance2);
    });

    it('should consider `elem` option for cache', () => {
        const instance1 = naming();
        const instance2 = naming({ delims: { elem: '==' } });

        expect(instance1).to.not.equal(instance2);
    });

    it('should consider `mod` option for cache', () => {
        const instance1 = naming();
        const instance2 = naming({ delims: { mod: '=' } });

        expect(instance1).to.not.equal(instance2);
    });

    it('should consider `wordPattern` option for cache', () => {
        const instance1 = naming();
        const instance2 = naming({ wordPattern: '[a-z]+' });

        expect(instance1).to.not.equal(instance2);
    });

    it('should cache instance of custom naming', () => {
        const opts = { delims: { elem: '__', mod: '--' } };
        const instance1 = naming(opts);
        const instance2 = naming(opts);

        expect(instance1).to.equal(instance2);
    });

    it('should cache instance of custom naming', () => {
        const instance1 = naming({ delims: { elem: '__', mod: '_' } });
        const instance2 = naming({ delims: { elem: '__', mod: '--' } });

        expect(instance1).to.not.equal(instance2);
    });
});
