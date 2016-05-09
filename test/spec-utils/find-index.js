'use strict';

const findIndex = require('../../spec/utils').findIndex;
const expect = require('chai').expect;

describe('spec utils: findIndex()', function () {
    it('should not find non existing block', function () {
        var decl = [{ block: 'block' }];

        expect(findIndex(decl, { block: 'other-block' })).to.be.equal(-1);
    });

    it('should not find non bem block', function () {
        expect(findIndex(['string'], 'string')).to.be.equal(-1);
    });

    it('should find block', function () {
        var entity = { block: 'block' },
            decl = [entity];

        expect(findIndex(decl, entity)).to.be.equal(0);
    });

    it('should find modifier of block', function () {
        var entity = { block: 'block', modName: 'mod', modVal: 'val' },
            decl = [entity];

        expect(findIndex(decl, entity)).to.be.equal(0);
    });

    it('should find element', function () {
        var entity = { block: 'block', elem: 'elem' },
            decl = [entity];

        expect(findIndex(decl, entity)).to.be.equal(0);
    });

    it('should find modifier of element', function () {
        var entity = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' },
            decl = [entity];

        expect(findIndex(decl, entity)).to.be.equal(0);
    });

    it('should find equal entity', function () {
        var decl = [{ block: 'other-block' }, { block: 'block' }, { block: 'other-block' }];

        expect(findIndex(decl, { block: 'block' })).to.be.equal(1);
    });

    it('should find equal entity by other object', function () {
        expect(findIndex([{ block: 'block' }], { block: 'block' })).to.be.equal(0);
    });

    it('should find first equal entity', function () {
        var decl = [{ block: 'block' }, { block: 'other-block' }, { block: 'block' }];

        expect(findIndex(decl, { block: 'block' })).to.be.equal(0);
    });
});
