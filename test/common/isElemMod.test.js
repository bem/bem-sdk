var naming = require('../../lib/bem-naming');

describe('common', function () {
    describe('isElemMod', function () {
        it('should detect mod of elem', function () {
            var notation = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' };

            naming.isElemMod(notation).should.be.true;
        });

        it('should detect boolean mod of elem by object without `modVal` field', function () {
            var notation = { block: 'block', elem: 'elem', modName: 'mod' };

            naming.isElemMod(notation).should.be.true;
        });

        it('should detect boolean mod of elem by strict object', function () {
            var notation = { block: 'block', elem: 'elem', modName: 'mod', modVal: true };

            naming.isElemMod(notation).should.be.true;
        });
    });
});
