'use strict';

const assert = require('assert');

const format = require('./format');

/**
 * Create string representation of declaration
 *
 * @param  {Array|Object} decl source declaration
 * @param  {Object} opts  additional options
 * @param  {String} opts.format format
 * @return {String}       string representation
 */
module.exports = function (decl, opts) {
    opts || (opts = {});
    assert(opts.format, 'You must declare target format');

    Array.isArray(decl) || (decl = [decl]);

    const formatedDecl = format(decl, { format: opts.format });
    const jsonStr = JSON.stringify(formatedDecl, null, 4);

    let exportsStr = '';

    if (opts.format === 'v1') {
        exportsStr = 'exports.blocks';
    } else if (opts.format === 'enb') {
        exportsStr = 'exports.deps';
    } else {
        exportsStr = 'module.exports';
    }

    return `${exportsStr} = ${jsonStr};\n`;
};
