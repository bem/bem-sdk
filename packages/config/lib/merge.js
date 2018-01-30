'use strict';

var mergeWith = require('lodash.mergewith');

/**
 * Merge all arguments to firt one.
 *
 * Consider arrays as simple value and not deep merge them.
 *
 * @example
 * result: {levels: Array<{path: string, layer: string}>, sets: Object<string,string|Array>}
 *
 * @param {Array<Object>} configs - array of configs
 * @returns {Object}
 */
module.exports = function merge(configs) {
    return mergeWith.apply(null, [].concat(
        Array.isArray(configs) ? configs : Array.from(arguments),
        function(objValue, srcValue) {
            if (Array.isArray(objValue)) { return srcValue; }
        }
    ));
};
