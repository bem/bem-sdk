var walk = require('../../lib/index');

module.exports = function (levels, opts, expected, cb) {
    var buffer = [],
        walker = walk(levels, opts);

    walker.on('data', function (obj) {
        buffer.push(obj);
    });

    walker.on('end', function () {
        try {
            buffer.must.eql(expected);
            cb();
        } catch (e) {
            cb(e);
        }
    });
};
