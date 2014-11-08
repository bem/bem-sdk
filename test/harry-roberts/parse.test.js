var naming = require('../../lib/bem-naming')({ elem: '__', mod: '--' });

describe('harry roberts', function () {
    describe('parse', function () {
        it('should not parse not valid string', function () {
            var obj = naming.parse('(*)-(*)');

            (typeof obj === 'undefined').should.be.true;
        });

        it('should have one filed if parse block', function () {
            var obj = naming.parse('block');

            Object.keys(obj).should.have.length(1);
        });

        it('should have three params if parse mod of block', function () {
            var obj = naming.parse('block--mod');

            Object.keys(obj).should.have.length(3);
        });

        it('should have two params if parse elem of block', function () {
            var obj = naming.parse('block__elem');

            Object.keys(obj).should.have.length(2);
        });

        it('should have four params if parse mod of elem', function () {
            var obj = naming.parse('block__elem--mod');

            Object.keys(obj).should.have.length(4);
        });

        it('should parse block', function () {
            var obj = naming.parse('block');

            obj.block.should.equal('block');
        });

        it('should parse mod of block', function () {
            var obj = naming.parse('block--mod--val');

            obj.block.should.equal('block');
            obj.modName.should.equal('mod');
            obj.modVal.should.equal('val');
        });

        it('should parse boolean mod of block', function () {
            var obj = naming.parse('block--mod');

            obj.block.should.equal('block');
            obj.modName.should.equal('mod');
            obj.modVal.should.be.true;
        });

        it('should parse elem', function () {
            var obj = naming.parse('block__elem');

            obj.block.should.equal('block');
            obj.elem.should.equal('elem');
        });

        it('should parse mod of elem', function () {
            var obj = naming.parse('block__elem--mod--val');

            obj.block.should.equal('block');
            obj.elem.should.equal('elem');
            obj.modName.should.equal('mod');
            obj.modVal.should.equal('val');
        });

        it('should parse boolean mod of elem', function () {
            var obj = naming.parse('block__elem--mod');

            obj.block.should.equal('block');
            obj.modName.should.equal('mod');
            obj.elem.should.equal('elem');
            obj.modVal.should.be.true;
        });
    });
});
