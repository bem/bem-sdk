'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemEntityName = require('..');

describe('is-bem-entity-name', () => {
    it('should check valid entities', () => {
        const entityName = new BemEntityName({ block: 'block' });

        expect(BemEntityName.isBemEntityName(entityName)).to.be.true;
    });

    it('should not pass entity representation object', () => {
        expect(BemEntityName.isBemEntityName({ block: 'block' })).to.be.false;
    });

    it('should not pass invalid entity', () => {
        expect(BemEntityName.isBemEntityName([])).to.be.false;
    });

    it('should not pass null', () => {
        expect(BemEntityName.isBemEntityName(null)).to.be.false;
    });

    it('should not pass undefined', () => {
        expect(BemEntityName.isBemEntityName(null)).to.be.false;
    });
});
