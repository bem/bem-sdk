'use strict';

var presets = require('.');

var DEFAULT_PRESET = 'origin';

module.exports = init;

/**
 * Returns an object with `delims`, `fs` and `wordPattern` properties
 * that describes the naming convention.
 *
 * @param {(Object|string)} [options] — user options or preset name.
 *                                      If not specified, default preset will be returned.
 * @param {string} [options.preset] — preset name that should be used as default preset.
 * @param {Object} [options.delims] — strings to separate names of bem entities.
 *                                    This object has the same structure with `INamingConventionDelims`,
 *                                    but all properties inside are optional.
 * @param {Object} [options.fs] — user options to separate names of files with bem entities.
 * @param {Object} [options.fs.delims] — strings to separate names of files in a BEM project.
 *                                       This object has the same structure with `INamingConventionDelims`,
 *                                       but all properties inside are optional.
 * @param {string} [options.fs.pattern] — pattern that describes the file structure of a BEM project.s
 * @param {string} [options.fs.scheme] — schema name that describes the file structure of one BEM entity.
 * @param {string} [options.wordPattern] — a regular expression that will be used to match an entity name.
 * @param {(Object|string)} [userDefaults] — default options that will override the options from default preset.
 * @returns {INamingConvention}
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
            elem: optionsDelims.elem || userDefaults.elem || defaultDelims.elem,
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
