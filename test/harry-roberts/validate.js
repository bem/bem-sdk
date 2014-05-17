var BEMNaming = require('../../lib/bem-naming').BEMNaming;
var naming = new BEMNaming({ elemSeparator: '-', modSeparator: '--', literal: '[a-zA-Z0-9]' });

describe('harry roberts', function () {
    describe('validate', function () {
        it('must validate block', function () {
            var res = naming.validate('block');

            res.must.be.true();
        });

        it('must validate mod of block', function () {
            var res = naming.validate('block--mod--val');

            res.must.be.true();
        });

        it('must validate boolean mod of block', function () {
            var res = naming.validate('block--mod');

            res.must.be.true();
        });

        it('must validate elem', function () {
            var res = naming.validate('block-elem');

            res.must.be.true();
        });

        it('must validate mod of elem', function () {
            var res = naming.validate('block-elem--mod--value');

            res.must.be.true();
        });

        it('must validate boolean mod of elem', function () {
            var res = naming.validate('block-elem--mod');

            res.must.be.true();
        });

        it('must not validate elem without block', function () {
            var res = naming.validate('-elem');

            res.must.be.false();
        });

        it('must not validate boolean mod without block', function () {
            var res = naming.validate('--mod');

            res.must.be.false();
        });

        it('must not validate mod without block', function () {
            var res = naming.validate('--mod--val');

            res.must.be.false();
        });

        it('must not validate mod of elem without block', function () {
            var res = naming.validate('-elem--mod--val');

            res.must.be.false();
        });

        it('must not validate boolean mod of elem without block', function () {
            var res = naming.validate('-elem--mod');

            res.must.be.false();
        });

        it('must not validate nested elem', function () {
            var res = naming.validate('block-elem1-elem2');

            res.must.be.false();
        });

        it('must not validate multi mod', function () {
            var res = naming.validate('block--mod--val-elem--mod--val');

            res.must.be.false();
        });

        it('must not validate block name with illegal literals', function () {
            var res = naming.validate('block__elem');

            res.must.be.false();
        });
    });
});
