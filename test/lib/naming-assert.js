var mockAndAssert = require('./mock-and-assert'),
    opts = { scheme: 'flat' },
    conventions = {
        original: { elem: '__', mod: '_' },
        csswizardry: { elem: '__', mod: '--' },
        custom: {
            elem: '-',
            mod: '--',
            wordPattern: '[a-zA-Z0-9]+'
        }
    };

module.exports = function (fs, expected) {
    var levels = Object.keys(fs).map(function (levelPath) {
        var naming = levelPath.indexOf('.') !== -1 && levelPath.split('.')[0],
            convention = conventions[naming],
            info = {
                path: levelPath
            };

        convention && (info.naming = convention);

        return info;
    });

    return mockAndAssert(fs, levels, opts, expected);
};
