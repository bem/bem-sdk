var BEMNaming = require('../../lib/bem-naming').BEMNaming;
var naming = new BEMNaming({ elemSeparator: '-', modSeparator: '--', literal: '[a-zA-Z0-9]' });

describe('harry roberts', function () {
    describe('isBlockMod', function () {
        it('must not detect mod of block in block', function () {
            var res = naming.isBlockMod('block');

            res.must.be.false();
        });

        it('must detect mod of block', function () {
            var res = naming.isBlockMod('block--mod--val');

            res.must.be.true();
        });

        it('must detect boolean mod of block', function () {
            var res = naming.isBlockMod('block--mod');

            res.must.be.true();
        });

        it('must not detect mod of block in elem', function () {
            var res = naming.isBlockMod('block-elem');

            res.must.be.false();
        });

        it('must not detect mod of block in mod of elem', function () {
            var res = naming.isBlockMod('block-elem--mod--value');

            res.must.be.false();
        });

        it('must not detect mod of block in boolean mod of elem', function () {
            var res = naming.isBlockMod('block-elem--mod');

            res.must.be.false();
        });
    });
});
