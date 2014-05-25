var naming = require('../../lib/bem-naming');

describe('original', function () {
    describe('validate', function () {
        it('must validate block', function () {
            naming.validate('block').must.be.true();
        });

        it('must validate mod of block', function () {
            naming.validate('block_mod_val').must.be.true();
        });

        it('must validate boolean mod of block', function () {
            naming.validate('block_mod').must.be.true();
        });

        it('must validate elem', function () {
            naming.validate('block__elem').must.be.true();
        });

        it('must validate mod of elem', function () {
            naming.validate('block__elem_mod_value').must.be.true();
        });

        it('must validate boolean mod of elem', function () {
            naming.validate('block__elem_mod').must.be.true();
        });

        it('must not validate elem without block', function () {
            naming.validate('__elem').must.be.false();
        });

        it('must not validate boolean mod without block', function () {
            naming.validate('_mod').must.be.false();
        });

        it('must not validate mod without block', function () {
            naming.validate('_mod_val').must.be.false();
        });

        it('must not validate mod of elem without block', function () {
            naming.validate('__elem_mod_val').must.be.false();
        });

        it('must not validate boolean mod of elem without block', function () {
            naming.validate('__elem_mod').must.be.false();
        });

        it('must not validate nested elem', function () {
            naming.validate('block__elem1__elem2').must.be.false();
        });

        it('must not validate multi mod', function () {
            naming.validate('block_mod_val__elem_mod_val').must.be.false();
        });

        it('must not validate block name with illegal literals', function () {
            naming.validate('^_^').must.be.false();
        });
    });
});
