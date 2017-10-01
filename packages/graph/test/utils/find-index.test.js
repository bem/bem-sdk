'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const findIndex = require('../../lib/test-utils').findIndex;

describe('utils/find-index', () => {
    it('should not find non existing block', () => {
        const decl = [{ entity: { block: 'block' } }];

        expect(findIndex(decl, { entity: { block: 'other-block' } })).to.equal(-1);
    });

    it('should not find non bem block', () => {
        expect(findIndex(['string'], 'string')).to.equal(-1);
    });

    it('should find block', () => {
        const entity = { entity: { block: 'block' } };
        const decl = [entity];

        expect(findIndex(decl, entity)).to.equal(0);
    });

    it('should find modifier of block', () => {
        const entity = { entity: { block: 'block', modName: 'mod', modVal: 'val' } };
        const decl = [entity];

        expect(findIndex(decl, entity)).to.equal(0);
    });

    it('should find element', () => {
        const entity = { entity: { block: 'block', elem: 'elem' } };
        const decl = [entity];

        expect(findIndex(decl, entity)).to.equal(0);
    });

    it('should find modifier of element', () => {
        const entity = { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } };
        const decl = [entity];

        expect(findIndex(decl, entity)).to.equal(0);
    });

    it('should find equal entity', () => {
        const decl = [
            { entity: { block: 'other-block' } },
            { entity: { block: 'block' } },
            { entity: { block: 'other-block' } }
        ];

        expect(findIndex(decl, { entity: { block: 'block' } })).to.equal(1);
    });

    it('should find equal entity by other object', () => {
        expect(findIndex([{ entity: { block: 'block' } }], { entity: { block: 'block' } })).to.equal(0);
    });

    it('should find first equal entity', () => {
        const decl = [
            { entity: { block: 'block' } },
            { entity: { block: 'other-block' } },
            { entity: { block: 'block' } }
        ];

        expect(findIndex(decl, { entity: { block: 'block' } })).to.equal(0);
    });
});
