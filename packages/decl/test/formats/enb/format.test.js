'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const format = require('../../../lib/formats/enb/format');

describe('format.enb', () => {
    it('should format to enb format', () => {
        expect(format({ entity: { block: 'block' }, tech: null }, { format: 'enb' })).to.deep.equal(
            [{ block: 'block' }]
        );
    });

    it('should format with elem', () => {
        expect(format([
            { entity: { block: 'block' }, tech: null },
            { entity: { block: 'block', elem: 'elem' }, tech: null }
        ], { format: 'enb' })).to.deep.equal([
            { block: 'block' },
            { block: 'block', elem: 'elem' }
        ]);
    });

    it('should format with mod', () => {
        expect(format([
            { entity: { block: 'block', mod: { name: 'mod', val: 'val' } }, tech: null }
        ], { format: 'enb' })).to.deep.equal([{ block: 'block', mod: 'mod', val: 'val' }]);
    });
});
