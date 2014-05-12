var BEMNaming = require('../lib/bem-naming').BEMNaming;

describe('custom', function () {
    it('must support harry roberts style', function () {
        var naming = new BEMNaming({ elemSeparator: '-', modSeparator: '--', literal: '[a-zA-Z0-9]' });
        var str = 'block-elem--mod--val';

        naming.stringify(naming.parse(str)).must.be.equal(str);
    });

    it('must support mixed style', function () {
        var naming = new BEMNaming({ elemSeparator: '__', modSeparator: '--', literal: '[a-zA-Z0-9-]' });
        var str = 'block__elem--mod--val';

        naming.stringify(naming.parse(str)).must.be.equal(str);
    });
});
