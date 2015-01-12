var naming = require('../../lib/bem-naming');

describe('common', function () {
    describe('cache', function () {
        it('should cache instance of original naming', function () {
            var instance1 = naming(),
                instance2 = naming();

            instance1.should.be.equal(instance2);
        });

        it('should consider `elem` option for cache', function () {
            var instance1 = naming(),
                instance2 = naming({ elem: '==' });

            instance1.should.be.not.equal(instance2);
        });

        it('should consider `mod` option for cache', function () {
            var instance1 = naming(),
                instance2 = naming({ mod: '=' });

            instance1.should.be.not.equal(instance2);
        });

        it('should consider `wordPattern` option for cache', function () {
            var instance1 = naming(),
                instance2 = naming({ wordPattern: '[a-z]+' });

            instance1.should.be.not.equal(instance2);
        });

        it('should cache instance of custom naming', function () {
            var opts = { elem: '__', mod: '--' },
                instance1 = naming(opts),
                instance2 = naming(opts);

            instance1.should.be.equal(instance2);
        });

        it('should differ options for cache', function () {
            var instance1 = naming({ elem: '__', mod: '_' }),
                instance2 = naming({ elem: '__', mod: '--' });

            instance1.should.be.not.equal(instance2);
        });
    });
});
