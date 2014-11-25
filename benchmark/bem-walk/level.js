var path = require('path'),
    walk = require('../..'),

    fixturesDirname = path.resolve(__dirname, '..', 'fixtures'),
    nestedLevelDirname = path.join(fixturesDirname, 'nested-level'),
    flatLevelDirname = path.join(fixturesDirname, 'flat-level');

suite('bem-walk', function () {
    set('iterations', 10000);
    set('type', 'static');

    bench('flat level', function (done) {
        var walker = walk([flatLevelDirname], { scheme: 'flat' });

        walker.on('data', function () { });
        walker.on('end', function () {
            done();
        });
    });

    bench('nested level', function (done) {
        var walker = walk([nestedLevelDirname], { scheme: 'nested' });

        walker.on('data', function () { });
        walker.on('end', function () {
            done();
        });
    });
});
