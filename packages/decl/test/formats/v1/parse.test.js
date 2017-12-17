'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const assert = require('chai').assert;

const simplifyCell = require('../../util').simplifyCell;
const parse = require('../../../lib/formats/v1').parse;

describe('decl.formats.v1.parse', () => {
    it('should throw if invalid format', () => {
        assert.throw(() => parse([{ block: 'block' }]), 'Invalid format of v1 declaration');
    });

    it('should parse decl with format field', () => {
        const cells = parse({ format: 'v1', blocks: [{ name: 'block' }] });

        assert.deepEqual(cells.map(simplifyCell), [{ entity: { block: 'block' }, tech: null }]);
    });

    it('should parse entity', () => {
        const cells = parse({ blocks: [{ name: 'block' }] });

        assert.deepEqual(cells.map(simplifyCell), [{ entity: { block: 'block' }, tech: null }]);
    });
});
