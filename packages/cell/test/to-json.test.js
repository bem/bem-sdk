'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemEntityName = require('@bem/sdk.entity-name');

const BemCell = require('../index');

describe('to-json', () => {
    it('should return stringified cell', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'button' }),
            tech: 'olala'
        });

        expect(JSON.stringify([cell])).to.equal('[{"entity":{"block":"button"},"tech":"olala"}]');
    });
});
