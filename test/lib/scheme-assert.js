'use strict';

const mockAndAssert = require('./mock-and-assert');
const schemes = {
    flat: true,
    nested: true
};

module.exports = function (fs, defaults, expected) {
    if (arguments.length === 2) {
        expected = defaults;
        defaults = {};
    }

    const config = {
        defaults: defaults,
        levels: {}
    };

    Object.keys(fs).forEach(levelname => {
        var scheme = levelname.indexOf('.') !== -1 && levelname.split('.')[0],
            info = {
                path: levelname
            };

        schemes[scheme] && (info.scheme = scheme);

        config.levels[levelname] = info;
    });

    return mockAndAssert(fs, Object.keys(config.levels), config, expected);
};
