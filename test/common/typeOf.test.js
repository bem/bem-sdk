var naming = require('../../lib/bem-naming');

describe('common', function () {
    describe('typeOf', function () {
        it('should not determine undefined', function () {
            var type = naming.typeOf(undefined);

            (typeof type === 'undefined').should.be.true;
        });

        it('should not determine empty string', function () {
            var type = naming.typeOf('');

            (typeof type === 'undefined').should.be.true;
        });

        it('should not determine empty object', function () {
            var type = naming.typeOf({});

            (typeof type === 'undefined').should.be.true;
        });

        it('should not determine not valid object', function () {
            var type = naming.typeOf({ bem: 'hello' });

            (typeof type === 'undefined').should.be.true;
        });

        it('should not determine object without `block` field', function () {
            var type = naming.typeOf({ elem: 'elem' });

            (typeof type === 'undefined').should.be.true;
        });

        it('should not determine mod of block if `modVal` field equal `false`', function () {
            var type = naming.typeOf({ block: 'block', modName: 'mod', modVal: false });

            (typeof type === 'undefined').should.be.true;
        });

        it('should not determine mod of elem if `modVal` field equal `false`', function () {
            var type = naming.typeOf({ block: 'block', elem: 'elem', modName: 'mod', modVal: false });

            (typeof type === 'undefined').should.be.true;
        });

        it('should determine block', function () {
            var notation = { block: 'block' };

            naming.typeOf(notation).should.equal('block');
        });

        it('should determine mod of block', function () {
            var notation = { block: 'block', modName: 'mod', modVal: 'val' };

            naming.typeOf(notation).should.equal('blockMod');
        });

        it('should determine boolean mod of block', function () {
            var notation = { block: 'block', modName: 'mod', modVal: true };

            naming.typeOf(notation).should.equal('blockMod');
        });

        it('should determine elem', function () {
            var notation = { block: 'block', elem: 'elem' };

            naming.typeOf(notation).should.equal('elem');
        });

        it('should determine mod of elem', function () {
            var notation = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' };

            naming.typeOf(notation).should.equal('elemMod');
        });

        it('should determine boolean mod of elem', function () {
            var notation = { block: 'block', elem: 'elem', modName: 'mod', modVal: true };

            naming.typeOf(notation).should.equal('elemMod');
        });
    });
});
