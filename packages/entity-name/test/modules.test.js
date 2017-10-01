'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemEntityName = require('..');

describe('modules', () => {
    it('should export to default', () => {
        expect(BemEntityName).to.equal(BemEntityName.default);
    });
});
