var path = require('path'),
    levels = path.resolve(__dirname, 'levels'),
    libs = path.resolve(__dirname, 'libs'),
    fixtures = {
        levels: {
            flat: [path.resolve(levels, 'flat.level')],
            nested: [path.resolve(levels, 'nested.level')]
        },
        libs: {
            'bem-bl': [
                'blocks-common',
                'blocks-desktop',
                'blocks-test',
                'blocks-touch'
            ].map(function (level) {
                return path.resolve(libs, 'bem-bl', level);
            }),
            'bem-core': [
                'common.blocks',
                'desktop.blocks',
                'touch.blocks'
            ].map(function (level) {
                return path.resolve(libs, 'bem-core', level);
            }),
            'bem-components': [
                'common.blocks',
                'desktop.blocks',
                'touch.blocks',
                'touch-pad.blocks',
                'touch-phone.blocks'
            ].map(function (level) {
                return path.resolve(libs, 'bem-components', level);
            })
        }
    };

fixtures.libs.o2 = [].concat(fixtures.libs['bem-core'], fixtures.libs['bem-components']);

module.exports = fixtures;
