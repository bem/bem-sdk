var naming = require('../../lib/bem-naming');

describe('original', function () {
    describe('isBlock', function () {
        it('must detect block by string', function () {
            naming.isBlock('block').must.be.true();
        });

        it('must detect block by object', function () {
            var notation = { block: 'block' };

            naming.isBlock(notation).must.be.true();
        });

        it('must not detect block in mod of block by string', function () {
            naming.isBlock('block_mod_val').must.be.false();
        });

        it('must not detect block in mod of block by object', function () {
            var notation = { block: 'block', modName: 'mod', modVal: 'val' };

            naming.isBlock(notation).must.be.false();
        });

        it('must not detect block in boolean mod of block by string', function () {
            naming.isBlock('block_mod').must.be.false();
        });

        it('must not detect block in boolean mod of block by object', function () {
            var notation = { block: 'block', modName: 'mod', modVal: true };

            naming.isBlock(notation).must.be.false();
        });

        it('must not detect block in elem  by string', function () {
            naming.isBlock('block__elem').must.be.false();
        });

        it('must not detect block in elem by object', function () {
            var notation = { block: 'block', elem: 'elem' };

            naming.isBlock(notation).must.be.false();
        });

        it('must not detect block in mod of elem by string', function () {
            naming.isBlock('block__elem_mod_value').must.be.false();
        });

        it('must not detect block in mod of elem by object', function () {
            var notation = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' };

            naming.isBlock(notation).must.be.false();
        });

        it('must not detect block in boolean mod of elem by string', function () {
            naming.isBlock('block__elem_mod').must.be.false();
        });

        it('must not detect block in boolean mod of elem by object', function () {
            var notation = { block: 'block', elem: 'elem', modName: 'mod', modVal: true };

            naming.isBlock(notation).must.be.false();
        });
    });
});
