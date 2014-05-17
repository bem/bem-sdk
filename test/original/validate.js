var naming = require('../../lib/bem-naming');

describe('original', function () {
    describe('validate', function () {
        it('must validate block', function () {
            var res = naming.validate('block');

            res.must.be.true();
        });

        it('must validate mod of block', function () {
            var res = naming.validate('block_mod_val');

            res.must.be.true();
        });

        it('must validate boolean mod of block', function () {
            var res = naming.validate('block_mod');

            res.must.be.true();
        });

        it('must validate elem', function () {
            var res = naming.validate('block__elem');

            res.must.be.true();
        });

        it('must validate mod of elem', function () {
            var res = naming.validate('block__elem_mod_value');

            res.must.be.true();
        });

        it('must validate boolean mod of elem', function () {
            var res = naming.validate('block__elem_mod');

            res.must.be.true();
        });

        it('must not validate elem without block', function () {
            var res = naming.validate('__elem');

            res.must.be.false();
        });

        it('must not validate boolean mod without block', function () {
            var res = naming.validate('_mod');

            res.must.be.false();
        });

        it('must not validate mod without block', function () {
            var res = naming.validate('_mod_val');

            res.must.be.false();
        });

        it('must not validate mod of elem without block', function () {
            var res = naming.validate('__elem_mod_val');

            res.must.be.false();
        });

        it('must not validate boolean mod of elem without block', function () {
            var res = naming.validate('__elem_mod');

            res.must.be.false();
        });

        it('must not validate nested elem', function () {
            var res = naming.validate('block__elem1__elem2');

            res.must.be.false();
        });

        it('must not validate multi mod', function () {
            var res = naming.validate('block_mod_val__elem_mod_val');

            res.must.be.false();
        });

        it('must not validate block name with illegal literals', function () {
            var res = naming.validate('^_^');

            res.must.be.false();
        });
    });
});
