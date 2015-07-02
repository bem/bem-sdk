var promisify = require('bluebird').promisify,
    walk = require('../../lib/index');

function assert(levels, config, expected, cb) {
    var buffer = [],
        walker = walk(levels, config),
        hasError = false;

    walker.on('data', function (obj) {
        buffer.push(obj);
    });

    walker.on ('end', function () {
        if (!hasError) {
            try {
                buffer.must.eql(expected);
                cb();
            } catch (err) {
                cb(err);
            }
        }
    });

    walker.on('error', function (err) {
        hasError = true;
        cb(err);
    });
}

module.exports = promisify(assert);
