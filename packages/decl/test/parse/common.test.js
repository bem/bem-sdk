'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const parse = require('../..').parse;

describe('parse.common', () => {
    it('should throw if undefined', () => {
        expect(() => parse()).to.throw(/Bemdecl must be String or Object/);
    });

    it('should throw if unsupported', () => {
        expect(() => parse('({ format: \'unknown\', components: [] })')).to.throw(/Unknown BEMDECL format/);
    });

    it('should throw if unsupported in object', () => {
        expect(() => parse({ format: 'unknown', components: [] })).to.throw(/Unknown BEMDECL format/);
    });

});
