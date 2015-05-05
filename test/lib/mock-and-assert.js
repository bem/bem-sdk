var mock = require('mock-fs'),
    assert = require('./assert');

module.exports = function (fs, levels, opts, expected) {
    Object.keys(fs).forEach(function (level) {
        var content = fs[level];

        if (content === false || content === undefined || content === null) {
            delete fs[level];
        }
    });

    mock(fs);

    return assert(levels, opts, expected)
        .finally(function () {
            mock.restore();
        });
};
