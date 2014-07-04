var demand = require('must');
var naming = require('../../lib/bem-naming');

describe('original', function () {
    describe('parse', function () {
        it('must not parse not valid string', function () {
            var obj = naming.parse('(*)_(*)');

            demand(obj).be.undefined();
        });

        it('must parse block', function () {
            var obj = naming.parse('block');

            obj.block.must.equal('block');
        });

        it('must parse mod of block', function () {
            var obj = naming.parse('block_mod_val');

            obj.block.must.equal('block');
            obj.modName.must.equal('mod');
            obj.modVal.must.equal('val');
        });

        it('must parse boolean mod of block', function () {
            var obj = naming.parse('block_mod');

            obj.block.must.equal('block');
            obj.modName.must.equal('mod');
            obj.modVal.must.be.true();
        });

        it('must parse elem', function () {
            var obj = naming.parse('block__elem');

            obj.block.must.equal('block');
            obj.elem.must.equal('elem');
        });

        it('must parse mod of elem', function () {
            var obj = naming.parse('block__elem_mod_val');

            obj.block.must.equal('block');
            obj.elem.must.equal('elem');
            obj.modName.must.equal('mod');
            obj.modVal.must.equal('val');
        });

        it('must parse boolean mod of elem', function () {
            var obj = naming.parse('block__elem_mod');

            obj.block.must.equal('block');
            obj.modName.must.equal('mod');
            obj.elem.must.equal('elem');
            obj.modVal.must.be.true();
        });
    });
});
