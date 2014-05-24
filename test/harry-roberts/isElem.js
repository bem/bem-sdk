var BEMNaming = require('../../lib/bem-naming').BEMNaming;
var naming = new BEMNaming({ elemSeparator: '-', modSeparator: '--', literal: '[a-zA-Z0-9]' });

describe('harry roberts', function () {
    describe('isElem', function () {
        it('must not detect elem in block', function () {
            var res = naming.isElem('block');

            res.must.be.false();
        });

        it('must not detect elem in mod of block', function () {
            var res = naming.isElem('block--mod--val');

            res.must.be.false();
        });

        it('must not detect elem in boolean mod of block', function () {
            var res = naming.isElem('block--mod');

            res.must.be.false();
        });

        it('must detect elem', function () {
            var res = naming.isElem('block-elem');

            res.must.be.true();
        });

        it('must not detect elem in mod of elem', function () {
            var res = naming.isElem('block-elem--mod--value');

            res.must.be.false();
        });

        it('must not detect elem in boolean mod of elem', function () {
            var res = naming.isElem('block-elem--mod');

            res.must.be.false();
        });
    });
});
