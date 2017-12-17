'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const assert = require('chai').assert;

const cellify = require('../../../lib/cellify');
const parse = require('../../../lib/formats/enb').parse;

describe('decl.formats.enb.parse', () => {
    it('should throw if invalid format', () => {
        assert.throw(() => parse([{ block: 'block' }]), 'Invalid format of enb declaration');
    });

    it('should parse block', () => {
        const cells = parse({ deps: [{ block: 'block' }] });

        assert.deepEqual(cells, cellify({ block: 'block' }));
    });

    it('should parse block with tech', () => {
        const cells = parse({ deps: [{ block: 'block', tech: 'tech' }] });

        assert.deepEqual(cells, cellify({ entity: 'block', tech: 'tech' }));
    });

    it('should parse elem', () => {
        const cells = parse({ deps: [{ block: 'block', elem: 'elem' }] });

        assert.deepEqual(cells, cellify({ block: 'block', elem: 'elem' }));
    });

    it('should parse mod', () => {
        const cells = parse({ deps: [{ block: 'block', mod: 'mod', val: 'val' }] });

        assert.deepEqual(cells, cellify({ block: 'block', mod: { name: 'mod', val: 'val' } }));
    });

    it('should parse simple mod', () => {
        const cells = parse({ deps: [{ block: 'block', mod: 'mod', val: true }] });

        assert.deepEqual(cells, cellify({ block: 'block', mod: 'mod' }));
    });

    it('should parse elem mod', () => {
        const cells = parse({ deps: [{ block: 'block', elem: 'elem', mod: 'mod', val: true }] });

        assert.deepEqual(cells, cellify({ block: 'block', elem: 'elem', mod: 'mod' }));
    });
});
