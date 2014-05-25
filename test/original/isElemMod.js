var naming = require('../../lib/bem-naming');

describe('original', function () {
    describe('isElemMod', function () {
        it('must not detect mod of elem in block', function () {
            naming.isElemMod('block').must.be.false();
        });

        it('must not detect mod of elem in mod of block', function () {
            naming.isElemMod('block_mod_val').must.be.false();
        });

        it('must not detect mod of elem in boolean mod of block', function () {
            naming.isElemMod('block_mod').must.be.false();
        });

        it('must not detect mod of elem in elem', function () {
            naming.isElemMod('block__elem').must.be.false();
        });

        it('must detect mod of elem', function () {
            naming.isElemMod('block__elem_mod_value').must.be.true();
        });

        it('must detect boolean mod of elem', function () {
            naming.isElemMod('block__elem_mod').must.be.true();
        });
    });
});
