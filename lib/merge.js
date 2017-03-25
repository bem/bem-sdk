var _ = require('lodash');

/**
 * Merge all arguments to firts one.
 * Consider arrays as simple value and not deep merge them.
 * @param {Array|Object} configs - array of configs or positional arguments
 * @return {Object}
 */
module.exports = function merge(configs) {
    var args = Array.isArray(configs) ? configs : _.toArray(arguments);
    args.push(function(objValue, srcValue) {
        if (Array.isArray(objValue)) { return srcValue; }
    });
    return _.mergeWith.apply(_, args);
};
