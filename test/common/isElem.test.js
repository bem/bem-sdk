var naming = require('../../lib/bem-naming');

describe('common', function () {
    describe('isElem', function () {
        it('should detect elem', function () {
            var notation = { block: 'block', elem: 'elem' };

            naming.isElem(notation).should.be.true;
        });
    });
});
