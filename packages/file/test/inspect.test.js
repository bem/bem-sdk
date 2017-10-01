'use strict';

const util = require('util');

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemFile = require('..');

describe('inspect', () => {
    it('should return entity object', () => {
        const file = new BemFile({
            cell: { entity: { block: 'block' }, tech: 'css' },
            level: 'asd/qwe'
        });

        expect(util.inspect(file))
            .to.match(/BemFile { cell: { entity: { block: 'block' }, tech: 'css' },\s+level: 'asd\/qwe' }/);
    });
});
