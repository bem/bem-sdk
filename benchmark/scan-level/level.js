var path = require('path'),
    scan = require('scan-level'),

    fixturesDirname = path.resolve(__dirname, '..', 'fixtures'),
    nestedLevelDirname = path.join(fixturesDirname, 'nested-level'),
    flatLevelDirname = path.join(fixturesDirname, 'flat-level');

suite('scan-level', function () {
    set('iterations', 10000);
    set('type', 'static');

    bench('flat level', function (done) {
        scan(flatLevelDirname, function (err) {
            done(err);
        });
    });

    bench('nested level', function (done) {
        scan(nestedLevelDirname, function (err) {
            done(err);
        });
    });
});
