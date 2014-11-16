var path = require('path'),
    Level = require('enb-bem-techs/lib/levels/level'),
    LevelPlain = require('enb-bem-techs/lib/levels/level-plain'),

    fixturesDirname = path.resolve(__dirname, '..', 'fixtures'),
    nestedLevelDirname = path.join(fixturesDirname, 'nested-level'),
    flatLevelDirname = path.join(fixturesDirname, 'flat-level');

suite('enb', function () {
    set('iterations', 10000);
    set('type', 'static');

    bench('flat level', function (done) {
        var level = new Level(flatLevelDirname, LevelPlain);

        level.load()
            .then(done, done);
    });

    bench('nested level', function (done) {
        var level = new Level(nestedLevelDirname);

        level.load()
            .then(done, done);
    });
});
