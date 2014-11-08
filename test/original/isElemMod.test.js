var naming = require('../../lib/bem-naming');

describe('original', function () {
    describe('isElemMod', function () {
        it('should detect mod of elem', function () {
            naming.isElemMod('block__elem_mod_val').should.be.true;
        });

        it('should detect boolean mod of elem', function () {
            naming.isElemMod('block__elem_mod').should.be.true;
        });
    });
});
