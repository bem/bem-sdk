var naming = require('../../lib/bem-naming');

describe('original', function () {
    describe('isBlockMod', function () {
        it('must not detect mod of block in block by string', function () {
            naming.isBlockMod('block').must.be.false();
        });

        it('must not detect mod of block in block by object', function () {
            var notation = { block: 'block' };

            naming.isBlockMod(notation).must.be.false();
        });

        it('must detect mod of block by string', function () {
            naming.isBlockMod('block_mod_val').must.be.true();
        });

        it('must detect mod of block by object', function () {
            var notation = { block: 'block', modName: 'mod', modVal: 'val' };

            naming.isBlockMod(notation).must.be.true();
        });

        it('must detect boolean mod of block by string', function () {
            naming.isBlockMod('block_mod').must.be.true();
        });

        it('must detect boolean mod of block by object', function () {
            var notation = { block: 'block', modName: 'mod', modVal: true };

            naming.isBlockMod(notation).must.be.true();
        });

        it('must not detect mod of block in elem by string', function () {
            naming.isBlockMod('block__elem').must.be.false();
        });

        it('must not detect mod of block in elem by object', function () {
            var notation = { block: 'block', elem: 'elem' };

            naming.isBlockMod(notation).must.be.false();
        });

        it('must not detect mod of block in mod of elem by string', function () {
            naming.isBlockMod('block__elem_mod_val').must.be.false();
        });

        it('must not detect mod of block in mod of elem by object', function () {
            var notation = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' };

            naming.isBlockMod(notation).must.be.false();
        });

        it('must not detect mod of block in mod of elem by string', function () {
            naming.isBlockMod('block__elem_mod').must.be.false();
        });

        it('must not detect mod of block in mod of elem by object', function () {
            var notation = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' };

            naming.isBlockMod(notation).must.be.false();
        });
    });
});
