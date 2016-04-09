var walk = require('../../lib/index');

function assert(levels, config, expected) {
    var buffer = [],
        walker = walk(levels, config),
        hasError = false;

    return new Promise(function (resolve, reject) {
        walker.on('data', function (obj) {
            buffer.push(obj);
        });

        walker.on('end', function () {
            if (!hasError) {
                try {
                    buffer.must.eql(expected);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            }
        });

        walker.on('error', function (err) {
            hasError = true;
            reject(err);
        });
    });
}

module.exports = assert;
