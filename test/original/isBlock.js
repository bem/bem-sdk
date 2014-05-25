var naming = require('../../lib/bem-naming');

describe('original', function () {
    describe('isBlock', function () {
        it('must detect block', function () {
            naming.isBlock('block').must.be.true();
        });

        it('must not detect block in mod of block', function () {
            naming.isBlock('block_mod_val').must.be.false();
        });

        it('must not detect block in boolean mod of block', function () {
            naming.isBlock('block_mod').must.be.false();
        });

        it('must not detect block in elem', function () {
            naming.isBlock('block__elem').must.be.false();
        });

        it('must not detect block in mod of elem', function () {
            naming.isBlock('block__elem_mod_value').must.be.false();
        });

        it('must not detect block in boolean mod of elem', function () {
            naming.isBlock('block__elem_mod').must.be.false();
        });
    });
});
