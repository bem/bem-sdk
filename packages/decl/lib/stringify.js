'use strict';

const assert = require('assert');
const JSON5 = require('json5');

const format = require('./format');

const DEFAULTS = { exportType: 'json', space: 4 };

// different format exports declaration in different fields
// and this specific point is used for detecting input format
// if it isn't passed. This logic performed by detect method
// which called from parse method.
const fieldByFormat = {
    v1: 'blocks',
    enb: 'deps',
    v2: 'deps'
};

const generators = {
    json5: (obj, space) => JSON5.stringify(obj, null, space),
    json: (obj, space) => JSON.stringify(obj, null, space),
    commonjs: (obj, space) => `module.exports = ${JSON5.stringify(obj, null, space)};\n`,
    es2015: (obj, space) => `export default ${JSON5.stringify(obj, null, space)};\n`
};
// Aliases
generators.es6 = generators.es2015;
generators.cjs = generators.commonjs;

/**
 * Create string representation of declaration
 *
 * @param {BemCell|BemCell[]} decl - source declaration
 * @param {Object} opts - additional options
 * @param {String} opts.format - format of declaration (v1, v2, enb)
 * @param {String} [opts.exportType=json5] - defines how to wrap result (commonjs, json5, json, es6|es2015)
 * @param {String|Number} [opts.space] - number of space characters or string to use as a white space
 * @returns {String}
 */
module.exports = function (decl, opts) {
    const options = Object.assign({}, DEFAULTS, opts);

    assert(options.format, 'You must declare target format');
    assert(fieldByFormat.hasOwnProperty(options.format), 'Specified format isn\'t supported');
    assert(generators.hasOwnProperty(options.exportType), 'Specified export type isn\'t supported');

    Array.isArray(decl) || (decl = [decl]);

    const formatedDecl = format(decl, { format: options.format });
    const field = fieldByFormat[options.format];
    let stringifiedObj = { format: options.format };

    if (field) {
        stringifiedObj[field] = formatedDecl;
    } else {
        stringifiedObj = formatedDecl;
    }

    return generators[options.exportType](stringifiedObj, options.space);
};
