'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemEntityName = require('@bem/sdk.entity-name');

const BemCell = require('../index');

describe('is-bem-cell', () => {
    it('should check valid entities', () => {
        const cell = new BemCell({
            entity: new BemEntityName({ block: 'block' })
        });

        expect(BemCell.isBemCell(cell)).to.equal(true);
    });

    it('should not pass invalid blocks', () => {
        expect(BemCell.isBemCell({})).to.equal(false);
        expect(BemCell.isBemCell([])).to.equal(false);
    });

    it('should not pass null', () => {
        expect(BemCell.isBemCell(null)).to.equal(false);
    });
});
