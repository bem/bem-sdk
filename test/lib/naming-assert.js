var mockAndAssert = require('./mock-and-assert'),
    defaults = { scheme: 'flat' },
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
    var config = {
        levels: {},
        defaults: defaults
    };

    Object.keys(fs).forEach(function (levelname) {
        var naming = levelname.indexOf('.') !== -1 && levelname.split('.')[0],
            convention = conventions[naming],
            info = {
                path: levelname
            };

        convention && (info.naming = convention);

        config.levels[levelname] = info;
    });

    return mockAndAssert(fs, Object.keys(config.levels), config, expected);
};
