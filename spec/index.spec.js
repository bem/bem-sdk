var lib = require('../lib/index'),
    decls = {
        v1: [{ name: 'block' }],
        v2: [{ block: 'block' }]
    };

describe('index', function () {
    it('must have `normalize` method', function () {
        lib.must.have.ownProperty('normalize');
        lib.normalize.must.be.a.function();
    });

    it('must support `BEMDECL 1.0` format', function () {
        lib.normalize(decls.v1)
            .must.eql(decls.v2);
    });

    it('must support `BEMDECL 2.0` format', function () {
        lib.normalize(decls.v2, { harmony: true })
            .must.eql(decls.v2);
    });

    it('must have `merge` method', function () {
        lib.must.have.ownProperty('merge');
        lib.merge.must.be.a.function();
    });

    it('must have `subtract` method', function () {
        lib.must.have.ownProperty('subtract');
        lib.subtract.must.be.a.function();
    });
});
