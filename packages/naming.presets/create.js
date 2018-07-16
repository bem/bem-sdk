'use strict';

var presets = require('.');

var DEFAULT_PRESET = 'origin';

module.exports = init;

/**
 * Returns delims and wordPattern.
 *
 * @param {Object} options - user options
 * @param {Object} [userDefaults] - defaults
 * @returns {INamingConventionDelims}
 */
function init(options, userDefaults) {
    if (!options) {
        return presets[DEFAULT_PRESET];
    }

    if (typeof options === 'string') {
        var preset = presets[options];

        if (!preset) {
            throw new Error('The `' + options + '` naming is unknown.');
        }

        return preset;
    }

    var defaultPreset = options.preset || DEFAULT_PRESET;

    // TODO: Warn about incorrect preset
    if (typeof userDefaults === 'string') {
        userDefaults = presets[userDefaults] || presets[DEFAULT_PRESET];
    } else if (!userDefaults) {
        userDefaults = {};
    }

    var defaults = presets[defaultPreset];
    var defaultDelims = userDefaults.delims || defaults.delims;
    var defaultModDelims = userDefaults.mod || defaultDelims.mod;
    var optionsDelims = options.delims || {};
    var mod = optionsDelims.mod || defaultModDelims;

    const res = {
        delims: {
            elem: optionsDelims.elem || userDefaults.elim || defaultDelims.elem,
            mod: typeof mod === 'string'
                ? { name: mod, val: mod }
                : {
                    name: mod.name || defaultModDelims.name,
                    val: mod.val || defaultModDelims.val
                }
        },
        fs: Object.assign({}, defaults.fs, userDefaults.fs, options.fs),
        wordPattern: options.wordPattern || userDefaults.wordPattern || defaults.wordPattern
    };

    return res;
}
