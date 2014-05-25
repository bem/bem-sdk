var naming = require('../lib/harry-roberts-naming');

describe('harry roberts', function () {
    describe('isElemMod', function () {
        it('must not detect mod of elem in block', function () {
            naming.isElemMod('block').must.be.false();
        });

        it('must not detect mod of elem in mod of block', function () {
            naming.isElemMod('block--mod--val').must.be.false();
        });

        it('must not detect mod of elem in boolean mod of block', function () {
            naming.isElemMod('block--mod').must.be.false();
        });

        it('must not detect mod of elem in elem', function () {
            naming.isElemMod('block-elem').must.be.false();
        });

        it('must detect mod of elem', function () {
            naming.isElemMod('block-elem--mod--value').must.be.true();
        });

        it('must detect boolean mod of elem', function () {
            naming.isElemMod('block-elem--mod').must.be.true();
        });
    });
});
