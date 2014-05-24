var naming = require('../../lib/bem-naming');

describe('original', function () {
    describe('isElemMod', function () {
        it('must not detect mod of elem in block', function () {
            var res = naming.isElemMod('block');

            res.must.be.false();
        });

        it('must not detect mod of elem in mod of block', function () {
            var res = naming.isElemMod('block_mod_val');

            res.must.be.false();
        });

        it('must not detect mod of elem in boolean mod of block', function () {
            var res = naming.isElemMod('block_mod');

            res.must.be.false();
        });

        it('must not detect mod of elem in elem', function () {
            var res = naming.isElemMod('block__elem');

            res.must.be.false();
        });

        it('must detect mod of elem', function () {
            var res = naming.isElemMod('block__elem_mod_value');

            res.must.be.true();
        });

        it('must detect boolean mod of elem', function () {
            var res = naming.isElemMod('block__elem_mod');

            res.must.be.true();
        });
    });
});
