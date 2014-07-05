var naming = require('../lib/harry-roberts-naming');

describe('harry roberts', function () {
    describe('isElemMod', function () {
        it('must not detect mod of elem by undefined', function () {
            naming.isElemMod(undefined).must.be.false();
        });

        it('must not detect mod of elem by empty object', function () {
            naming.isElemMod({}).must.be.false();
        });

        it('must not detect mod of elem by not valid object notation', function () {
            naming.isElemMod({ elem: 'elem', modName: 'mod', modVal: 'val' }).must.be.false();
        });

        it('must not detect mod of elem in block by string', function () {
            naming.isElemMod('block').must.be.false();
        });

        it('must not detect mod of elem in block by object', function () {
            var notation = { block: 'block' };

            naming.isElemMod(notation).must.be.false();
        });

        it('must not detect mod of elem in mod of block by string', function () {
            naming.isElemMod('block--mod--val').must.be.false();
        });

        it('must not detect mod of elem in mod of block by object', function () {
            var notation = { block: 'block', modName: 'mod', modVal: 'val' };

            naming.isElemMod(notation).must.be.false();
        });

        it('must not detect mod of elem in boolean mod of block by string', function () {
            naming.isElemMod('block--mod').must.be.false();
        });

        it('must not detect mod of elem in boolean mod of block by object', function () {
            var notation = { block: 'block', modName: 'mod', modVal: true };

            naming.isElemMod(notation).must.be.false();
        });

        it('must not detect mod of elem in elem by string', function () {
            naming.isElemMod('block-elem').must.be.false();
        });

        it('must not detect mod of elem in elem by object', function () {
            var notation = { block: 'block', elem: 'elem' };

            naming.isElemMod(notation).must.be.false();
        });

        it('must detect mod of elem by string', function () {
            naming.isElemMod('block-elem--mod--val').must.be.true();
        });

        it('must detect mod of elem by object', function () {
            var notation = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' };

            naming.isElemMod(notation).must.be.true();
        });

        it('must detect boolean mod of elem by string', function () {
            naming.isElemMod('block-elem--mod').must.be.true();
        });

        it('must detect boolean mod of elem by object', function () {
            var notation = { block: 'block', elem: 'elem', modName: 'mod', modVal: true };

            naming.isElemMod(notation).must.be.true();
        });
    });
});
