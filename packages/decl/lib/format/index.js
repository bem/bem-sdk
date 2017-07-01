'use strict';

const assert = require('assert');

const isNotSupported = () => {
    throw new Error(
        'This format isn\'t supported yet, file an issue: https://github.com/bem/bem-sdk/issues/new?labels=pkg:decl'
    );
};

const formatters = {
    enb: require('./enb'),
    v2: isNotSupported,
    v1: require('./v1'),
    harmony: isNotSupported
};

/**
 * Format normalized declaration to target format
 *
 * @param  {Array|Object} decl normalized declaration
 * @param  {Object}       opts Addtional options
 * @param  {String}       opts.format format format
 * @return {Array}        Array with converted declaration
 */
module.exports = function (decl, opts) {
    opts || (opts = {});

    const format = opts.format;

    assert(format, 'You must declare target format');

    if (!formatters[format]) {
        throw new Error('Unknown format');
    }

    return formatters[format](decl);
};
