'use strict';

/**
 * Forms a string according to object representation of BEM entity.
 *
 * @param {Object|BemEntityName} entity - object representation of BEM entity.
 * @param {INamingConventionDelims} delims - separates entity names from each other.
 * @returns {String}
 */
function stringify(entity, delims) {
    if (!entity || !entity.block) {
        return '';
    }

    var res = [entity.block];

    if (entity.elem !== undefined) {
        res.push(delims.elem, entity.elem);
    }

    var mod = entity.mod;
    if (mod !== undefined) {
        var val = mod.val;
        if (typeof mod === 'string') {
            res.push(delims.mod.name, mod);
        } else if (val || !('val' in mod)) {
            res.push(delims.mod.name, mod.name);

            if (val && val !== true) {
                res.push(delims.mod.val, val);
            }
        }
    }

    return res.join('');
}

/**
 * Creates `stringify` function for specified naming convention.
 *
 * @param {INamingConvention} convention - options for naming convention.
 * @returns {Function}
 */
function stringifyWrapper(convention) {
    // TODO: https://github.com/bem/bem-sdk/issues/326
    // console.assert(convention.delims && convention.delims.elem && convention.delims.mod,
    //     '@bem/sdk.naming.entity.stringify: convention should be an instance of BemNamingEntityConvention');
    return function (entity) {
        return stringify(entity, convention.delims);
    };
}

module.exports = stringifyWrapper;
module.exports.stringifyWrapper = stringifyWrapper;
