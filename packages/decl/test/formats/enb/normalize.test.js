'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const assert = require('chai').assert;

const cellify = require('../../../lib/cellify');
const normalize = require('../../../lib/formats/enb/normalize');

describe('decl.formats.enb.normalize', () => {
    it('should normalize block', () => {
        const cells = normalize([{ block: 'block' }]);

        assert.deepEqual(cells, cellify({ block: 'block' }));
    });

    it('should normalize block with tech', () => {
        const cells = normalize([{ block: 'block', tech: 'tech' }]);

        assert.deepEqual(cells, cellify({ entity: 'block', tech: 'tech' }));
    });

    it('should normalize elem', () => {
        const cells = normalize([{ block: 'block', elem: 'elem' }]);

        assert.deepEqual(cells, cellify({ block: 'block', elem: 'elem' }));
    });

    it('should normalize mod', () => {
        const cells = normalize([{ block: 'block', mod: 'mod', val: 'val' }]);

        assert.deepEqual(cells, cellify({ block: 'block', mod: { name: 'mod', val: 'val' } }));
    });

    it('should normalize simple mod', () => {
        const cells = normalize([{ block: 'block', mod: 'mod', val: true }]);

        assert.deepEqual(cells, cellify({ block: 'block', mod: 'mod' }));
    });

    it('should normalize elem mod', () => {
        const cells = normalize([{ block: 'block', elem: 'elem', mod: 'mod', val: true }]);

        assert.deepEqual(cells, cellify({ block: 'block', elem: 'elem', mod: 'mod' }));
    });
});
