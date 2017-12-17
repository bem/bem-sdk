'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const assert = require('chai').assert;

const simplifyCell = require('../../util').simplifyCell;
const parse = require('../../../lib/formats/harmony').parse;

describe('decl.formats.harmony.parse', () => {
    it('should throw if invalid format', () => {
        assert.throw(() => parse([{ block: 'block' }]), 'Invalid format of harmony declaration');
    });

    it('should parse empty decl', () => {
        const cells = parse({ format: 'harmony', decl: [] });

        assert.deepEqual(cells.map(simplifyCell), []);
    });

    it('should parse decl with format field', () => {
        const cells = parse({ format: 'harmony', decl: [{ block: 'block' }] });

        assert.deepEqual(cells.map(simplifyCell), [{ entity: { block: 'block' }, tech: null }]);
    });

    it('should parse entity', () => {
        const cells = parse({ decl: [{ block: 'block' }] });

        assert.deepEqual(cells.map(simplifyCell), [{ entity: { block: 'block' }, tech: null }]);
    });
});
