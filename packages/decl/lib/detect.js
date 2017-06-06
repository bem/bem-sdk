'use strict';

const assert = require('assert');

/**
 * Detects decl format
 *
 * @param  {Object} obj Declaration object
 * @return {String}
 */
module.exports = function (obj) {
    assert(typeof obj === 'object', 'Argument must be an object');

    if (typeof obj.blocks === 'object') {
        return 'v1';
    } else if (typeof obj.deps === 'object') {
        return 'enb';
    } else if (typeof obj.decl === 'object' || Array.isArray(obj)) {
        return 'v2';
    }
};
