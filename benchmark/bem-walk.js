var walk = require('../lib'),
    fixtures = require('./fixtures');

suite('bem-walk', function () {
    set('mintime', 1000);

    bench('`flat` level', function (done) {
        run(fixtures.levels.flat, { scheme: 'flat' }, done);
    });

    bench('`nested` level', function (done) {
        run(fixtures.levels.nested, { scheme: 'nested' }, done);
    });

    bench('`bem-bl`', function (done) {
        run(fixtures.libs['bem-bl'], { scheme: 'nested' }, done);
    });

    bench('`bem-core` + `bem-components`', function (done) {
        run(fixtures.libs.o2, { scheme: 'nested' }, done);
    });
});

function run(levels, opts, done) {
    var walker = walk(levels, opts);

    walker.on('data', function () { });
    walker.on('end', function () {
        done();
    });
}
