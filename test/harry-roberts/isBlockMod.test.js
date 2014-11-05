var naming = require('../../lib/bem-naming')({ elem: '__', mod: '--' });

describe('harry roberts', function () {
    describe('isBlockMod', function () {
        it('should not detect mod of block by undefined', function () {
            naming.isBlockMod(undefined).should.be.false;
        });

        it('should not detect mod of block by empty object', function () {
            naming.isBlockMod({}).should.be.false;
        });

        it('should not detect mod of block by not valid string', function () {
            naming.isBlockMod('(*)_(*)').should.be.false;
        });

        it('should not detect mod of block by not valid object', function () {
            naming.isBlockMod({ modName: 'mod' }).should.be.false;
        });

        it('should not detect mod of block by not valid object notation', function () {
            naming.isBlockMod({ modName: 'mod', modVal: 'val' }).should.be.false;
        });

        it('should not detect mod of block in block by string', function () {
            naming.isBlockMod('block').should.be.false;
        });

        it('should not detect mod of block in block by object', function () {
            var notation = { block: 'block' };

            naming.isBlockMod(notation).should.be.false;
        });

        it('should detect mod of block by string', function () {
            naming.isBlockMod('block--mod--val').should.be.true;
        });

        it('should detect mod of block by object', function () {
            var notation = { block: 'block', modName: 'mod', modVal: 'val' };

            naming.isBlockMod(notation).should.be.true;
        });

        it('should detect boolean mod of block by string', function () {
            naming.isBlockMod('block--mod').should.be.true;
        });

        it('should detect boolean mod of block by object without `modVal` field', function () {
            var notation = { block: 'block', modName: 'mod' };

            naming.isBlockMod(notation).should.be.true;
        });

        it('should detect boolean mod of block by strict object', function () {
            var notation = { block: 'block', modName: 'mod', modVal: true };

            naming.isBlockMod(notation).should.be.true;
        });

        it('should not detect mod of block in elem by string', function () {
            naming.isBlockMod('block__elem').should.be.false;
        });

        it('should not detect mod of block in elem by object', function () {
            var notation = { block: 'block', elem: 'elem' };

            naming.isBlockMod(notation).should.be.false;
        });

        it('should not detect mod of block in mod of elem by string', function () {
            naming.isBlockMod('block__elem--mod--val').should.be.false;
        });

        it('should not detect mod of block in mod of elem by object', function () {
            var notation = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' };

            naming.isBlockMod(notation).should.be.false;
        });

        it('should not detect mod of block in boolean mod of elem by string', function () {
            naming.isBlockMod('block__elem--mod').should.be.false;
        });

        it('should not detect mod of block in boolean mod of elem by object', function () {
            var notation = { block: 'block', elem: 'elem', modName: 'mod', modVal: true };

            naming.isBlockMod(notation).should.be.false;
        });
    });
});
