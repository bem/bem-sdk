var naming = require('../../lib/bem-naming');

describe('original', function () {
    describe('isElem', function () {
        it('must not detect elem in block', function () {
            naming.isElem('block').must.be.false();
        });

        it('must not detect elem in mod of block', function () {
            naming.isElem('block_mod_val').must.be.false();
        });

        it('must not detect elem in boolean mod of block', function () {
            naming.isElem('block_mod').must.be.false();
        });

        it('must detect elem', function () {
            naming.isElem('block__elem').must.be.true();
        });

        it('must not detect elem in mod of elem', function () {
            naming.isElem('block__elem_mod_value').must.be.false();
        });

        it('must not detect elem in boolean mod of elem', function () {
            naming.isElem('block__elem_mod').must.be.false();
        });
    });
});
