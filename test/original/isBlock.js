var naming = require('../../lib/bem-naming');

describe('original', function () {
    describe('isBlock', function () {
        it('must detect block', function () {
            var res = naming.isBlock('block');

            res.must.be.true();
        });

        it('must not detect block in mod of block', function () {
            var res = naming.isBlock('block_mod_val');

            res.must.be.false();
        });

        it('must not detect block in boolean mod of block', function () {
            var res = naming.isBlock('block_mod');

            res.must.be.false();
        });

        it('must not detect block in elem', function () {
            var res = naming.isBlock('block__elem');

            res.must.be.false();
        });

        it('must not detect block in mod of elem', function () {
            var res = naming.isBlock('block__elem_mod_value');

            res.must.be.false();
        });

        it('must not detect block in boolean mod of elem', function () {
            var res = naming.isBlock('block__elem_mod');

            res.must.be.false();
        });
    });
});
