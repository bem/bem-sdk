var naming = require('../lib/harry-roberts-naming');

describe('harry roberts', function () {
    describe('isElem', function () {
        it('must not detect elem in block', function () {
            naming.isElem('block').must.be.false();
        });

        it('must not detect elem in mod of block', function () {
            naming.isElem('block--mod--val').must.be.false();
        });

        it('must not detect elem in boolean mod of block', function () {
            naming.isElem('block--mod').must.be.false();
        });

        it('must detect elem', function () {
            naming.isElem('block-elem').must.be.true();
        });

        it('must not detect elem in mod of elem', function () {
            naming.isElem('block-elem--mod--value').must.be.false();
        });

        it('must not detect elem in boolean mod of elem', function () {
            naming.isElem('block-elem--mod').must.be.false();
        });
    });
});
