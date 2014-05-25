var naming = require('../lib/harry-roberts-naming');

describe('harry roberts', function () {
    describe('validate', function () {
        it('must validate block', function () {
            naming.validate('block').must.be.true();
        });

        it('must validate mod of block', function () {
            naming.validate('block--mod--val').must.be.true();
        });

        it('must validate boolean mod of block', function () {
            naming.validate('block--mod').must.be.true();
        });

        it('must validate elem', function () {
            naming.validate('block-elem').must.be.true();
        });

        it('must validate mod of elem', function () {
            naming.validate('block-elem--mod--value').must.be.true();
        });

        it('must validate boolean mod of elem', function () {
            naming.validate('block-elem--mod').must.be.true();
        });

        it('must not validate elem without block', function () {
            naming.validate('-elem').must.be.false();
        });

        it('must not validate boolean mod without block', function () {
            naming.validate('--mod').must.be.false();
        });

        it('must not validate mod without block', function () {
            naming.validate('--mod--val').must.be.false();
        });

        it('must not validate mod of elem without block', function () {
            naming.validate('-elem--mod--val').must.be.false();
        });

        it('must not validate boolean mod of elem without block', function () {
            naming.validate('-elem--mod').must.be.false();
        });

        it('must not validate nested elem', function () {
            naming.validate('block-elem1-elem2').must.be.false();
        });

        it('must not validate multi mod', function () {
            naming.validate('block--mod--val-elem--mod--val').must.be.false();
        });

        it('must not validate block name with illegal literals', function () {
            naming.validate('block__elem').must.be.false();
        });
    });
});
