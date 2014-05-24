var naming = require('../../lib/bem-naming');

describe('original', function () {
    describe('isElem', function () {
        it('must not detect elem in block', function () {
            var res = naming.isElem('block');

            res.must.be.false();
        });

        it('must not detect elem in mod of block', function () {
            var res = naming.isElem('block_mod_val');

            res.must.be.false();
        });

        it('must not detect elem in boolean mod of block', function () {
            var res = naming.isElem('block_mod');

            res.must.be.false();
        });

        it('must detect elem', function () {
            var res = naming.isElem('block__elem');

            res.must.be.true();
        });

        it('must not detect elem in mod of elem', function () {
            var res = naming.isElem('block__elem_mod_value');

            res.must.be.false();
        });

        it('must not detect elem in boolean mod of elem', function () {
            var res = naming.isElem('block__elem_mod');

            res.must.be.false();
        });
    });
});
