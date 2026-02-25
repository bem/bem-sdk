/**
 * Deep merge helper.
 * Merges objects recursively but treats arrays as atomic values (replaces, not concatenates).
 * Mutates and returns the first object (like lodash.mergeWith).
 *
 * @param {Array|Object} configs - array of configs or positional arguments
 * @return {Object}
 */

function isPlainObject(val) {
    return val !== null && typeof val === 'object' && !Array.isArray(val);
}

function deepMergeTwo(target, source) {
    for (const key of Object.keys(source)) {
        const srcVal = source[key];
        const tgtVal = target[key];
        if (Array.isArray(tgtVal)) {
            // customizer: arrays are replaced, not deep-merged
            target[key] = srcVal;
        } else if (isPlainObject(tgtVal) && isPlainObject(srcVal)) {
            deepMergeTwo(tgtVal, srcVal);
        } else {
            target[key] = srcVal;
        }
    }
    return target;
}

export default function merge(configs) {
    const args = Array.isArray(configs) ? configs : Array.from(arguments);
    if (args.length === 0) { return {}; }
    return args.reduce((acc, obj) => {
        if (obj == null) { return acc; }
        return deepMergeTwo(acc, obj);
    });
}
