var fs = require('fs'),
    path = require('path'),
    walk = require('../..'),

    fixturesDirname = path.resolve(__dirname, '..', 'fixtures'),
    libsDirname = path.join(fixturesDirname, 'libs'),

    platforms = ['common', 'desktop', 'touch', 'touch-pad', 'touch-phone', 'test'],
    bl = getLevels(platforms, ['bem-bl']),
    core = getLevels(platforms, ['bem-core', 'bem-components', 'bem-components/design']),
    all = [].concat(bl, core);

suite('bem-walk', function () {
    set('iterations', 1000);
    set('concurrency', 10);

    bench('`bem-bl`', function (done) {
        var walker = walk(bl);

        walker.on('data', function () { });
        walker.on('end', function () {
            done();
        });
    });

    bench('`bem-core` + `bem-components`', function (done) {
        var walker = walk(core);

        walker.on('data', function () { });
        walker.on('end', function () {
            done();
        });
    });

    bench('`bem-bl` + `bem-core` + `bem-components`', function (done) {
        var walker = walk(all);

        walker.on('data', function () { });
        walker.on('end', function () {
            done();
        });
    });
});

function getLevels(platforms, libraries) {
    var levels = [],
        libs = libraries.map(function (lib) {
            return path.join(libsDirname, lib);
        });

    platforms.forEach(function (platform) {
        libs.forEach(function (lib) {
            var level1 = path.join(lib, platform + '.blocks'),
                level2 = path.join(lib, 'blocks-' + platform);

            fs.existsSync(level1) && levels.push(level1);
            fs.existsSync(level2) && levels.push(level2);
        });
    });

    return levels;
}
