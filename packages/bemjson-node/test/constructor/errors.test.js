'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemjsonNode = require('../..');

describe('test errors', () => {
    it('should throw error if not `block` field', () => {
        expect(() => new BemjsonNode({ elem: 'elem' })).to.throw(
            /`block` field should be a non empty string/
        );
    });

    it('should throw error if `elem` field has non-string value', () => {
        expect(() => new BemjsonNode({ block: 'b', elem: {} })).to.throw(
            /`elem` field should be a non-empty string/
        );
    });

    it('should throw error if `elemMods` field is empty object', () => {
        expect(() => new BemjsonNode({ block: 'block', elemMods: {} })).to.throw(
            /`elemMods` field should not be used without `elem` field/
        );
    });

    it('should throw error if `mods` field has invalid value', () => {
        expect(() => new BemjsonNode({ block: 'block', mods: 'string' })).to.throw(
            /`mods` field should be a simple object or null/
        );
    });

    it('should throw error if `elemMods` field used is empty object', () => {
        expect(() => new BemjsonNode({ block: 'block', elem: 'e', elemMods: 'string' })).to.throw(
            /`elemMods` field should be a simple object or null/
        );
    });
});
