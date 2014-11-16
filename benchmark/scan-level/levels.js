var fs = require('fs'),
    path = require('path'),
    vow = require('vow'),
    promisify = require('vow-node').promisify,
    scan = promisify(require('scan-level')),

    fixturesDirname = path.resolve(__dirname, '..', 'fixtures'),
    libsDirname = path.join(fixturesDirname, 'libs'),

    platforms = ['common', 'desktop', 'touch', 'touch-pad', 'touch-phone', 'test'],
    bl = getLevels(platforms, ['bem-bl']),
    core = getLevels(platforms, ['bem-core', 'bem-components', 'bem-components/design']),
    all = [].concat(bl, core);

suite('scan-level', function () {
    set('iterations', 1000);
    set('concurrency', 10);

    bench('`bem-bl`', function (done) {
        vow.all(bl.map(function (level) {
            return scan(level);
        })).then(done, done);
    });

    bench('`bem-core` + `bem-components`', function (done) {
        vow.all(core.map(function (level) {
            return scan(level);
        })).then(done, done);
    });

    bench('`bem-bl` + `bem-core` + `bem-components`', function (done) {
        vow.all(all.map(function (level) {
            return scan(level);
        })).then(done, done);
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
