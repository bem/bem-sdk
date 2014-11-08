var naming = require('../../lib/bem-naming')({ elem: '__', mod: '--' });

describe('harry roberts', function () {
    describe('isElem', function () {
        it('should detect elem', function () {
            naming.isElem('block__elem').should.be.true;
        });
    });
});
