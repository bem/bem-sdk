var BEMNaming = require('../../lib/bem-naming').BEMNaming;
var naming = new BEMNaming({ elemSeparator: '-', modSeparator: '--', literal: '[a-zA-Z0-9]' });

describe('harry roberts', function () {
    describe('isElemMod', function () {
        it('must not detect mod of elem in block', function () {
            var res = naming.isElemMod('block');

            res.must.be.false();
        });

        it('must not detect mod of elem in mod of block', function () {
            var res = naming.isElemMod('block--mod--val');

            res.must.be.false();
        });

        it('must not detect mod of elem in boolean mod of block', function () {
            var res = naming.isElemMod('block--mod');

            res.must.be.false();
        });

        it('must not detect mod of elem in elem', function () {
            var res = naming.isElemMod('block-elem');

            res.must.be.false();
        });

        it('must detect mod of elem', function () {
            var res = naming.isElemMod('block-elem--mod--value');

            res.must.be.true();
        });

        it('must detect boolean mod of elem', function () {
            var res = naming.isElemMod('block-elem--mod');

            res.must.be.true();
        });
    });
});
