var naming = require('../../lib/bem-naming');

describe('common', function () {
    describe('stringify', function () {
        it('should not stringify not valid notation', function () {
            naming.stringify.bind(naming, {})
                .should.throw('The field `block` is undefined. It is impossible to stringify BEM notation.');
        });
    });
});
