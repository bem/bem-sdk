var naming = require('../../lib/bem-naming');

describe('original', function () {
    describe('isBlockMod', function () {
        it('must not detect mod of block in block', function () {
            var res = naming.isBlockMod('block');

            res.must.be.false();
        });

        it('must detect mod of block', function () {
            var res = naming.isBlockMod('block_mod_val');

            res.must.be.true();
        });

        it('must detect boolean mod of block', function () {
            var res = naming.isBlockMod('block_mod');

            res.must.be.true();
        });

        it('must not detect mod of block in elem', function () {
            var res = naming.isBlockMod('block__elem');

            res.must.be.false();
        });

        it('must not detect mod of block in mod of elem', function () {
            var res = naming.isBlockMod('block__elem_mod_value');

            res.must.be.false();
        });

        it('must not detect mod of block in boolean mod of elem', function () {
            var res = naming.isBlockMod('block__elem_mod');

            res.must.be.false();
        });
    });
});
