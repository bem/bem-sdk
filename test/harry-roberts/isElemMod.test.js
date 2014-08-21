var naming = require('../lib/harry-roberts-naming');

describe('harry roberts', function () {
    describe('isElemMod', function () {
        it('should not detect mod of elem by undefined', function () {
            naming.isElemMod(undefined).should.be.false;
        });

        it('should not detect mod of elem by empty object', function () {
            naming.isElemMod({}).should.be.false;
        });

        it('should not detect mod of elem by not valid string', function () {
            naming.isElemMod('(*)_(*)').should.be.false;
        });

        it('should not detect mod of elem by not valid object', function () {
            naming.isElemMod({ modName: 'mod' }).should.be.false;
        });

        it('should not detect mod of elem by not valid object notation', function () {
            naming.isElemMod({ elem: 'elem', modName: 'mod', modVal: 'val' }).should.be.false;
        });

        it('should not detect mod of elem in block by string', function () {
            naming.isElemMod('block').should.be.false;
        });

        it('should not detect mod of elem in block by object', function () {
            var notation = { block: 'block' };

            naming.isElemMod(notation).should.be.false;
        });

        it('should not detect mod of elem in mod of block by string', function () {
            naming.isElemMod('block--mod--val').should.be.false;
        });

        it('should not detect mod of elem in mod of block by object', function () {
            var notation = { block: 'block', modName: 'mod', modVal: 'val' };

            naming.isElemMod(notation).should.be.false;
        });

        it('should not detect mod of elem in boolean mod of block by string', function () {
            naming.isElemMod('block--mod').should.be.false;
        });

        it('should not detect mod of elem in boolean mod of block by object', function () {
            var notation = { block: 'block', modName: 'mod', modVal: true };

            naming.isElemMod(notation).should.be.false;
        });

        it('should not detect mod of elem in elem by string', function () {
            naming.isElemMod('block__elem').should.be.false;
        });

        it('should not detect mod of elem in elem by object', function () {
            var notation = { block: 'block', elem: 'elem' };

            naming.isElemMod(notation).should.be.false;
        });

        it('should detect mod of elem by string', function () {
            naming.isElemMod('block__elem--mod--val').should.be.true;
        });

        it('should detect mod of elem by object', function () {
            var notation = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' };

            naming.isElemMod(notation).should.be.true;
        });

        it('should detect boolean mod of elem by string', function () {
            naming.isElemMod('block__elem--mod').should.be.true;
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
