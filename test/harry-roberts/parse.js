var BEMNaming = require('../../lib/bem-naming').BEMNaming;
var naming = new BEMNaming({ elemSeparator: '-', modSeparator: '--', literal: '[a-zA-Z0-9]' });

describe('harry roberts', function () {
    describe('parse', function () {
        it('must parse block', function () {
            var obj = naming.parse('block');

            obj.block.must.equal('block');
        });

        it('must parse mod of block', function () {
            var obj = naming.parse('block--mod--val');

            obj.block.must.equal('block');
            obj.modName.must.equal('mod');
            obj.modVal.must.equal('val');
        });

        it('must parse boolean mod of block', function () {
            var obj = naming.parse('block--mod');

            obj.block.must.equal('block');
            obj.modName.must.equal('mod');
            obj.modVal.must.be.true();
        });

        it('must parse elem', function () {
            var obj = naming.parse('block-elem');

            obj.block.must.equal('block');
            obj.elem.must.equal('elem');
        });

        it('must parse mod of elem', function () {
            var obj = naming.parse('block-elem--mod--val');

            obj.block.must.equal('block');
            obj.elem.must.equal('elem');
            obj.modName.must.equal('mod');
            obj.modVal.must.equal('val');
        });

        it('must parse boolean mod of elem', function () {
            var obj = naming.parse('block-elem--mod');

            obj.block.must.equal('block');
            obj.modName.must.equal('mod');
            obj.elem.must.equal('elem');
            obj.modVal.must.be.true();
        });
    });
});
