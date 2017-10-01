'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const inspect = require('util').inspect;

const BemEntityName = require('..');

describe('inspect.test.js', () => {
    it('should return entity object', () => {
        const obj = { block: 'block' };
        const entityName = new BemEntityName(obj);

        expect(inspect(entityName)).to.equal(`BemEntityName { block: 'block' }`);
    });
});
