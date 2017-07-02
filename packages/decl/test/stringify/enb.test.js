'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemCell = require('@bem/sdk.cell');
const JSON5 = require('json5');

const stringify = require('../../lib/stringify');

const obj = {
    format: 'enb',
    decl: [{ block: 'block', elem: 'elem', mod: 'mod', val: 'val' }]
};
const cell = BemCell.create({ block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' });

describe('stringify.enb', () => {
    it('should throws error if no format given', () => {
        expect(() => stringify(cell)).to.throw('You must declare target format');
    });

    it('should stringify enb declaration with commonJS', () => {
        expect(
            stringify(cell, { format: 'enb', exportType: 'commonjs' })
        ).to.equal(`module.exports = ${JSON5.stringify(obj, null, 4)};\n`);
    });

    it('should stringify enb declaration with es6', () => {
        expect(
            stringify(cell, { format: 'enb', exportType: 'es6' })
        ).to.equal(`export default ${JSON5.stringify(obj, null, 4)};\n`);
    });

    it('should stringify enb declaration with es2105', () => {
        expect(
            stringify(cell, { format: 'enb', exportType: 'es2015' })
        ).to.equal(`export default ${JSON5.stringify(obj, null, 4)};\n`);
    });

    it('should stringify enb declaration with JSON', () => {
        expect(
            stringify(cell, { format: 'enb', exportType: 'json' })
        ).to.equal(JSON.stringify(obj, null, 4));
    });

    it('should stringify enb declaration with JSON5', () => {
        expect(
            stringify(cell, { format: 'enb', exportType: 'json5' })
        ).to.equal(JSON5.stringify(obj, null, 4));
    });

    it('should stringify enb declaration with JSON if no exportType given', () => {
        expect(
            stringify(cell, { format: 'enb' })
        ).to.equal(JSON.stringify(obj, null, 4));
    });
});
