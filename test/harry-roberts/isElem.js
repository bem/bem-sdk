var naming = require('../lib/harry-roberts-naming');

describe('harry roberts', function () {
    describe('isElem', function () {
        it('should not detect elem by undefined', function () {
            naming.isElem(undefined).should.be.false;
        });

        it('should not detect elem by empty object', function () {
            naming.isElem({}).should.be.false;
        });

        it('should not detect elem by not valid object notation', function () {
            naming.isElem({ elem: 'elem' }).should.be.false;
        });

        it('should not detect elem in block by string', function () {
            naming.isElem('block').should.be.false;
        });

        it('should not detect elem in block by object', function () {
            var notation = { block: 'block' };

            naming.isElem(notation).should.be.false;
        });

        it('should not detect elem in mod of block by string', function () {
            naming.isElem('block--mod--val').should.be.false;
        });

        it('should not detect elem in mod of block by object', function () {
            var notation = { block: 'block', modName: 'mod', modVal: 'val' };

            naming.isElem(notation).should.be.false;
        });

        it('should not detect elem in boolean mod of block by string', function () {
            naming.isElem('block--mod').should.be.false;
        });

        it('should not detect elem in boolean mod of block by object', function () {
            var notation = { block: 'block', modName: 'mod', modVal: true };

            naming.isElem(notation).should.be.false;
        });

        it('should detect elem by string', function () {
            naming.isElem('block-elem').should.be.true;
        });

        it('should detect elem by object', function () {
            var notation = { block: 'block', elem: 'elem' };

            naming.isElem(notation).should.be.true;
        });

        it('should not detect elem in mod of elem by string', function () {
            naming.isElem('block-elem--mod--val').should.be.false;
        });

        it('should not detect elem in mod of elem by object', function () {
            var notation = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' };

            naming.isElem(notation).should.be.false;
        });

        it('should not detect elem in boolean mod of elem by string', function () {
            naming.isElem('block-elem--mod').should.be.false;
        });

        it('should not detect elem in boolean mod of elem by object', function () {
            var notation = { block: 'block', elem: 'elem', modName: 'mod', modVal: true };

            naming.isElem(notation).should.be.false;
        });
    });
});
