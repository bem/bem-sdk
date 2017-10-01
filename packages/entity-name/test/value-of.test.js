'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemEntityName = require('..');

describe('value-of.test.js', () => {
    it('should return normalized object', () => {
        const entity = new BemEntityName({ block: 'block', mod: 'mod' });

        expect(entity.valueOf()).to.deep.equal({ block: 'block', mod: { name: 'mod', val: true } });
    });
});
