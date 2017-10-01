'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const findLastIndex = require('../../lib/test-utils').findLastIndex;

describe('utils/find-last-index', () => {
    it('should not find non existing block', () => {
        var decl = [{ entity: { block: 'block' } }];

        expect(findLastIndex(decl, { entity: { block: 'other-block' } })).to.equal(-1);
    });

    it('should not find non bem block', () => {
        expect(findLastIndex(['string'], 'string')).to.equal(-1);
    });

    it('should find block', () => {
        var entity = { entity: { block: 'block' } },
            decl = [entity];

        expect(findLastIndex(decl, entity)).to.equal(0);
    });

    it('should find modifier of block', () => {
        var entity = { entity: { block: 'block', modName: 'mod', modVal: 'val' } },
            decl = [entity];

        expect(findLastIndex(decl, entity)).to.equal(0);
    });

    it('should find element', () => {
        var entity = { entity: { block: 'block', elem: 'elem' } },
            decl = [entity];

        expect(findLastIndex(decl, entity)).to.equal(0);
    });

    it('should find modifier of element', () => {
        var entity = { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } },
            decl = [entity];

        expect(findLastIndex(decl, entity)).to.equal(0);
    });

    it('should find equal entity', () => {
        var decl = [
            { entity: { block: 'other-block' } },
            { entity: { block: 'block' } },
            { entity: { block: 'other-block' } }
        ];

        expect(findLastIndex(decl, { entity: { block: 'block' } })).to.equal(1);
    });

    it('should find equal block by other object', () => {
        expect(findLastIndex([{ entity: { block: 'block' } }], { entity: { block: 'block' } })).to.equal(0);
    });

    it('should find last equal entity', () => {
        var decl = [
            { entity: { block: 'block' } },
            { entity: { block: 'other-block' } },
            { entity: { block: 'block' } }
        ];

        expect(findLastIndex(decl, { entity: { block: 'block' } })).to.equal(2);
    });
});
