var naming = require('../lib/harry-roberts-naming');

describe('harry roberts', function () {
    describe('isBlock', function () {
        it('must detect block', function () {
            naming.isBlock('block').must.be.true();
        });

        it('must not detect block in mod of block', function () {
            naming.isBlock('block--mod--val').must.be.false();
        });

        it('must not detect block in boolean mod of block', function () {
            naming.isBlock('block--mod').must.be.false();
        });

        it('must not detect block in elem', function () {
            naming.isBlock('block-elem').must.be.false();
        });

        it('must not detect block in mod of elem', function () {
            naming.isBlock('block-elem--mod--value').must.be.false();
        });

        it('must not detect block in boolean mod of elem', function () {
            naming.isBlock('block-elem--mod').must.be.false();
        });
    });
});
