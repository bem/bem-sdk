import * as __presets__ from './';
import { Presets } from './types';

const DEFAULT_PRESET = 'origin';
// Use alias because namespace not has index signature
const presets: Presets = __presets__;

module.exports = init;

/**
 * Returns delims and wordPattern.
 *
 * @param {Object} options - user options
 * @param {Object} [userDefaults] - defaults
 * @returns {INamingConventionDelims}
 */
function init(options: any, userDefaults: any) {
    if (!options) {
        return presets[DEFAULT_PRESET];
    }

    if (typeof options === 'string') {
        const preset = presets[options];

        if (!preset) {
            throw new Error('The `' + options + '` naming is unknown.');
        }

        return preset;
    }

    const defaultPreset = options.preset || DEFAULT_PRESET;

    // TODO: Warn about incorrect preset
    if (typeof userDefaults === 'string') {
        userDefaults = presets[userDefaults] || presets[DEFAULT_PRESET];
    } else if (!userDefaults) {
        userDefaults = {};
    }

    const defaults = presets[defaultPreset];
    const defaultDelims = userDefaults.delims || defaults.delims;
    const defaultModDelims = userDefaults.mod || defaultDelims.mod;
    const optionsDelims = options.delims || {};
    const mod = optionsDelims.mod || defaultModDelims;

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
        fs: { ...defaults.fs, ...userDefaults.fs, ...options.fs },
        wordPattern: options.wordPattern || userDefaults.wordPattern || defaults.wordPattern
    };

    return res;
}
