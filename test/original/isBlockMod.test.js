var naming = require('../../lib/bem-naming');

describe('original', function () {
    describe('isBlockMod', function () {
        it('should detect mod of block', function () {
            naming.isBlockMod('block_mod_val').should.be.true;
        });

        it('should detect boolean mod of block', function () {
            naming.isBlockMod('block_mod').should.be.true;
        });
    });
});
