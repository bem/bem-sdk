import assert from 'node:assert';

/**
 * Detects decl format
 *
 * @param  {Object} obj Declaration object
 * @return {String}
 */
export default function (obj) {
    assert(typeof obj === 'object', 'Argument must be an object');

    if (typeof obj.blocks === 'object') {
        return 'v1';
    } else if (typeof obj.deps === 'object') {
        return 'enb';
    } else if (typeof obj.decl === 'object' || Array.isArray(obj)) {
        return 'v2';
    }
}
