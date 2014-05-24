var BEMNaming = require('../../lib/bem-naming').BEMNaming;
var naming = new BEMNaming({ elemSeparator: '-', modSeparator: '--', literal: '[a-zA-Z0-9]' });

describe('harry roberts', function () {
    describe('isBlock', function () {
        it('must detect block', function () {
            var res = naming.isBlock('block');

            res.must.be.true();
        });

        it('must not detect block in mod of block', function () {
            var res = naming.isBlock('block--mod--val');

            res.must.be.false();
        });

        it('must not detect block in boolean mod of block', function () {
            var res = naming.isBlock('block--mod');

            res.must.be.false();
        });

        it('must not detect block in elem', function () {
            var res = naming.isBlock('block-elem');

            res.must.be.false();
        });

        it('must not detect block in mod of elem', function () {
            var res = naming.isBlock('block-elem--mod--value');

            res.must.be.false();
        });

        it('must not detect block in boolean mod of elem', function () {
            var res = naming.isBlock('block-elem--mod');

            res.must.be.false();
        });
    });
});
