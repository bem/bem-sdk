var naming = require('../../lib/bem-naming');

describe('original', function () {
    describe('typeOf', function () {
        it('should not determine not valid string', function () {
            var type = naming.typeOf('(*)_(*)');

            (typeof type === 'undefined').should.be.true;
        });

        it('should determine block', function () {
            naming.typeOf('block').should.equal('block');
        });

        it('should determine mod of block', function () {
            naming.typeOf('block_mod_val').should.equal('blockMod');
        });

        it('should determine boolean mod of block', function () {
            naming.typeOf('block_mod').should.equal('blockMod');
        });

        it('should determine elem', function () {
            naming.typeOf('block__elem').should.equal('elem');
        });

        it('should determine mod of elem', function () {
            naming.typeOf('block__elem_mod_value').should.equal('elemMod');
        });

        it('should determine boolean mod of elem', function () {
            naming.typeOf('block__elem_mod').should.equal('elemMod');
        });
    });
});
