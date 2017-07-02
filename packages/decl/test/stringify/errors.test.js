'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemCell = require('@bem/sdk.cell');
const stringify = require('../../lib/stringify');

const cell = BemCell.create({ block: 'block' });

describe('stringify.errors', () => {
    it('should throws error if no format given', () => {
        expect(() => stringify(cell)).to.throw('You must declare target format');
    });

    it('should throws error if unsupported format given', () => {
        expect(() => stringify(cell, { format: 'unsupported' })).to.throw('Specified format isn\'t supported');
    });

    it('should throws error if unsupported exportType given', () => {
        expect(
            () => stringify(cell, {
                format: 'enb',
                exportType: 'unsupported'
            })
        ).to.throw('Specified export type isn\'t supported');
    });
});
