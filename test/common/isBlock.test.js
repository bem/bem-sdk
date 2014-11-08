var naming = require('../../lib/bem-naming');

describe('common', function () {
    describe('isBlock', function () {
        it('should detect block', function () {
            var notation = { block: 'block' };

            naming.isBlock(notation).should.be.true;
        });
    });
});
