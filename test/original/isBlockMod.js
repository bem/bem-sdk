var naming = require('../../lib/bem-naming');

describe('original', function () {
    describe('isBlockMod', function () {
        it('must not detect mod of block in block', function () {
            naming.isBlockMod('block').must.be.false();
        });

        it('must detect mod of block', function () {
            naming.isBlockMod('block_mod_val').must.be.true();
        });

        it('must detect boolean mod of block', function () {
            naming.isBlockMod('block_mod').must.be.true();
        });

        it('must not detect mod of block in elem', function () {
            naming.isBlockMod('block__elem').must.be.false();
        });

        it('must not detect mod of block in mod of elem', function () {
            naming.isBlockMod('block__elem_mod_value').must.be.false();
        });

        it('must not detect mod of block in boolean mod of elem', function () {
            naming.isBlockMod('block__elem_mod').must.be.false();
        });
    });
});
