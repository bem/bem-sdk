var naming = require('../../lib/bem-naming');

describe('original', function () {
    describe('isElem', function () {
        it('must not detect elem in block by string', function () {
            naming.isElem('block').must.be.false();
        });

        it('must not detect elem in block by object', function () {
            var notation = { block: 'block' };

            naming.isElem(notation).must.be.false();
        });

        it('must not detect elem in mod of block by string', function () {
            naming.isElem('block_mod_val').must.be.false();
        });

        it('must not detect elem in mod of block by object', function () {
            var notation = { block: 'block', modName: 'mod', modVal: 'val' };

            naming.isElem(notation).must.be.false();
        });

        it('must not detect elem in boolean mod of block by string', function () {
            naming.isElem('block_mod').must.be.false();
        });

        it('must not detect elem in boolean mod of block by object', function () {
            var notation = { block: 'block', modName: 'mod', modVal: true };

            naming.isElem(notation).must.be.false();
        });

        it('must detect elem by string', function () {
            naming.isElem('block__elem').must.be.true();
        });

        it('must detect elem by object', function () {
            var notation = { block: 'block', elem: 'elem' };

            naming.isElem(notation).must.be.true();
        });

        it('must not detect elem in mod of elem by string', function () {
            naming.isElem('block__elem_mod_val').must.be.false();
        });

        it('must not detect elem in mod of elem by object', function () {
            var notation = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' };

            naming.isElem(notation).must.be.false();
        });

        it('must not detect elem in boolean mod of elem by string', function () {
            naming.isElem('block__elem_mod').must.be.false();
        });

        it('must not detect elem in boolean mod of elem by object', function () {
            var notation = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' };

            naming.isElem(notation).must.be.false();
        });
    });
});
