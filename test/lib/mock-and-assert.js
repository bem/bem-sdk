var mock = require('mock-fs'),
    assert = require('./assert');

module.exports = function (fs, levels, opts, expected) {
    mock(fs);

    return assert(levels, opts, expected)
        .finally(function () {
            mock.restore();
        });
};
