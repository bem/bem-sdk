'use strict';

const mockAndAssert = require('./mock-and-assert');
const defaults = { scheme: 'flat' };
const conventions = {
    original: { elem: '__', mod: '_' },
    csswizardry: { elem: '__', mod: '--' },
    custom: {
        elem: '-',
        mod: '--',
        wordPattern: '[a-zA-Z0-9]+'
    }
};

module.exports = function (fs, expected) {
    const config = {
        levels: {},
        defaults: defaults
    };

    Object.keys(fs).forEach(levelname => {
        const naming = levelname.indexOf('.') !== -1 && levelname.split('.')[0];
        const convention = conventions[naming];
        const info = {
            path: levelname
        };

        convention && (info.naming = convention);

        config.levels[levelname] = info;
    });

    return mockAndAssert(fs, Object.keys(config.levels), config, expected);
};
