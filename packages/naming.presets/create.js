'use strict';

var presets = require('.');
var defaults = presets.origin;

module.exports = init;

/**
 * Returns delims and wordPattern.
 *
 * @param {Object} options - user options
 * @returns {INamingConventionDelims}
 */
function init(options) {
    if (!options) {
        return presets.origin;
    }

    if (typeof options === 'string') {
        var preset = presets[options];

        if (!preset) {
            throw new Error('The `' + options + '` naming is unknown.');
        }

        return preset;
    }

    var defaultDelims = defaults.delims;
    var defaultModDelims = defaultDelims.mod;
    var optionsDelims = options.delims || {};
    var mod = optionsDelims.mod || defaultDelims.mod;

    return {
        delims: {
            elem: optionsDelims.elem || defaultDelims.elem,
            mod: typeof mod === 'string'
                ? { name: mod, val: mod }
                : {
                    name: mod.name || defaultModDelims.name,
                    val: mod.val || defaultModDelims.val
                }
        },
        fs: {
            ...defaults.fs,
            ...options.fs
        },
        wordPattern: options.wordPattern || defaults.wordPattern
    };
}
