var naming = require('../../lib/bem-naming');

describe('common', function () {
    describe('isBlockMod', function () {
        it('should detect mod of block', function () {
            var notation = { block: 'block', modName: 'mod', modVal: 'val' };

            naming.isBlockMod(notation).should.be.true;
        });

        it('should detect boolean mod of block by object without `modVal` field', function () {
            var notation = { block: 'block', modName: 'mod' };

            naming.isBlockMod(notation).should.be.true;
        });

        it('should detect boolean mod of block by strict object', function () {
            var notation = { block: 'block', modName: 'mod', modVal: true };

            naming.isBlockMod(notation).should.be.true;
        });
    });
});
