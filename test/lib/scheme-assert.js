var mockAndAssert = require('./mock-and-assert'),
    schemes = {
        flat: true,
        nested: true
    };

module.exports = function (fs, opts, expected) {
    if (arguments.length === 2) {
        expected = opts;
        opts = {};
    }

    var levels = Object.keys(fs).map(function (levelPath) {
        var scheme = levelPath.indexOf('.') !== -1 && levelPath.split('.')[0],
            info = {
                path: levelPath
            };

        schemes[scheme] && (info.scheme = scheme);

        return info;
    });

    return mockAndAssert(fs, levels, opts, expected);
};
