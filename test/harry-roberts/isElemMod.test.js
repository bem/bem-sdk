var naming = require('../../lib/bem-naming')({ elem: '__', mod: '--' });

describe('harry roberts', function () {
    describe('isElemMod', function () {
        it('should detect mod of elem', function () {
            naming.isElemMod('block__elem--mod').should.be.true;
        });
    });
});
