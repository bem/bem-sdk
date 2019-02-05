'use strict';

const assert = require('assert');

const formats = require('./formats');

/**
 * Formats a normalized declaration to the target format
 *
 * @param  {Array|Object} decl normalized declaration
 * @param  {Object} [opts] Additional options
 * @param  {string} opts.format target format
 * @return {Array} Array with converted declaration
 */
module.exports = function (decl, opts) {
    opts || (opts = {});

    const formatName = opts.format;

    assert(formatName, 'You must declare target format');

    const format = formats[formatName];

    if (!format) {
        throw new Error('Unknown format');
    }

    return format.format(decl);
};
