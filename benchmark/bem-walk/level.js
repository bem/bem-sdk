var path = require('path'),
    walk = require('../..'),

    fixturesDirname = path.resolve(__dirname, '..', 'fixtures'),
    nestedLevelDirname = path.join(fixturesDirname, 'nested-level');

suite('bem-walk', function () {
    set('iterations', 10000);
    set('type', 'static');

    bench('nested level', function (done) {
        var walker = walk([nestedLevelDirname]);

        walker.on('data', function () { });
        walker.on('end', function () {
            done();
        });
    });
});
