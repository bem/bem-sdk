var naming = require('../lib/harry-roberts-naming');

describe('harry roberts', function () {
    describe('isBlockMod', function () {
        it('must not detect mod of block in block', function () {
            naming.isBlockMod('block').must.be.false();
        });

        it('must detect mod of block', function () {
            naming.isBlockMod('block--mod--val').must.be.true();
        });

        it('must detect boolean mod of block', function () {
            naming.isBlockMod('block--mod').must.be.true();
        });

        it('must not detect mod of block in elem', function () {
            naming.isBlockMod('block-elem').must.be.false();
        });

        it('must not detect mod of block in mod of elem', function () {
            naming.isBlockMod('block-elem--mod--value').must.be.false();
        });

        it('must not detect mod of block in boolean mod of elem', function () {
            naming.isBlockMod('block-elem--mod').must.be.false();
        });
    });
});
