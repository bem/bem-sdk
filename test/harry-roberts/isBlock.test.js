var naming = require('../../lib/bem-naming')({ elem: '__', mod: '--' });

describe('harry roberts', function () {
    describe('isBlock', function () {
        it('should detect block', function () {
            naming.isBlock('block').should.be.true;
        });
    });
});
