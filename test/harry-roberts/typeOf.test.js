var naming = require('../../lib/bem-naming')({ elem: '__', mod: '--' });

describe('harry roberts', function () {
    describe('typeOf', function () {
        it('should not determine not valid string', function () {
            var type = naming.typeOf('(*)--(*)');

            (typeof type === 'undefined').should.be.true;
        });

        it('should determine block', function () {
            naming.typeOf('block').should.equal('block');
        });

        it('should determine mod of block', function () {
            naming.typeOf('block--mod').should.equal('blockMod');
        });

        it('should determine elem', function () {
            naming.typeOf('block__elem').should.equal('elem');
        });

        it('should determine mod of elem', function () {
            naming.typeOf('block__elem--mod').should.equal('elemMod');
        });
    });
});
