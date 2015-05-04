var promisify = require('bluebird').promisify,
    walk = require('../../lib/index');

function assert(levels, opts, expected, cb) {
    var buffer = [],
        walker = walk(levels, opts);

    walker.on('data', function (obj) {
        buffer.push(obj);
    });

    walker.on('end', function () {
        try {
            buffer.must.eql(expected);
            cb();
        } catch (err) {
            cb(err);
        }
    });
}

module.exports = promisify(assert);
