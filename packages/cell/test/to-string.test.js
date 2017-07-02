'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemEntityName = require('@bem/sdk.entity-name');

const BemCell = require('../index');

describe('to-string', () => {
    it('should return string', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'block' })
        });

        expect(cell.toString()).to.be.a('string');
        expect(cell.toString()).to.be.equal(cell.id);
    });
});
