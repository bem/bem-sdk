'use strict';

const findLastIndex = require('../../spec/utils').findLastIndex;
const expect = require('chai').expect;

describe('spec utils: findLastIndex()', function () {
    it('should not find non existing block', function () {
        var decl = [{ block: 'block' }];

        expect(findLastIndex(decl, { block: 'other-block' })).to.be.equal(-1);
    });

    it('should not find non bem block', function () {
        expect(findLastIndex(['string'], 'string')).to.be.equal(-1);
    });

    it('should find block', function () {
        var entity = { block: 'block' },
            decl = [entity];

        expect(findLastIndex(decl, entity)).to.be.equal(0);
    });

    it('should find modifier of block', function () {
        var entity = { block: 'block', modName: 'mod', modVal: 'val' },
            decl = [entity];

        expect(findLastIndex(decl, entity)).to.be.equal(0);
    });

    it('should find element', function () {
        var entity = { block: 'block', elem: 'elem' },
            decl = [entity];

        expect(findLastIndex(decl, entity)).to.be.equal(0);
    });

    it('should find modifier of element', function () {
        var entity = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' },
            decl = [entity];

        expect(findLastIndex(decl, entity)).to.be.equal(0);
    });

    it('should find equal entity', function () {
        var decl = [{ block: 'other-block' }, { block: 'block' }, { block: 'other-block' }];

        expect(findLastIndex(decl, { block: 'block' })).to.be.equal(1);
    });

    it('should find equal block by other object', function () {
        expect(findLastIndex([{ block: 'block' }], { block: 'block' })).to.be.equal(0);
    });

    it('should find last equal entity', function () {
        var decl = [{ block: 'block' }, { block: 'other-block' }, { block: 'block' }];

        expect(findLastIndex(decl, { block: 'block' })).to.be.equal(2);
    });
});
