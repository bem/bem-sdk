'use strict';

const util = require('util');

const describe = require('mocha').describe;
const it = require('mocha').it;
const expect = require('chai').expect;

const BemEntityName = require('@bem/sdk.entity-name');
const BemCell = require('../index');

describe('inspect', () => {
    it('should return entity object', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'block' }),
            tech: 'css'
        });

        const message = `BemCell { entity: { block: 'block' }, tech: 'css' }`;
        expect(util.inspect(cell)).to.equal(message);
    });
});
