var naming = require('../../lib/bem-naming')({ elem: '__', mod: '--' });

describe('harry roberts', function () {
    describe('isBlockMod', function () {
        it('should detect mod of block', function () {
            naming.isBlockMod('block--mod').should.be.true;
        });
    });
});
