'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemEntityName = require('..');

describe('to-json', () => {
    it('should create stringified object', () => {
        const entityName = new BemEntityName({ block: 'button' });

        expect(JSON.stringify([entityName])).to.equal('[{"block":"button"}]');
    });

    it('should return normalized object', () => {
        const entityName = new BemEntityName({ block: 'button' });

        expect(entityName.toJSON()).to.deep.equal(entityName.valueOf());
    });
});
