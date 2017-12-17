'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const assert = require('chai').assert;

const simplifyCell = require('../../util').simplifyCell;
const parse = require('../../../lib/formats/enb').parse;

describe('decl.formats.enb.parse', () => {
    it('should throw if invalid format', () => {
        assert.throw(() => parse([{ block: 'block' }]), 'Invalid format of enb declaration');
    });

    it('should parse decl with format field', () => {
        const cells = parse({ format: 'enb', deps: [{ block: 'block' }] });

        assert.deepEqual(cells.map(simplifyCell), [{ entity: { block: 'block' }, tech: null }]);
    });

    it('should parse entity', () => {
        const cells = parse({ deps: [{ block: 'block' }] });

        assert.deepEqual(cells.map(simplifyCell), [{ entity: { block: 'block' }, tech: null }]);
    });
});
