'use strict';

const mock = require('mock-fs');
const assert = require('./assert');

module.exports = function (fs, levels, config, expected) {
    Object.keys(fs).forEach(level => {
        const content = fs[level];

        if (content === false || content === undefined || content === null) {
            delete fs[level];
        }
    });

    mock(fs);

    return assert(levels, config, expected)
        .then(() => mock.restore())
        .catch(() => mock.restore());
};
