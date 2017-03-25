'use strict';

const fs = require('fs');
const promisify = require('es6-promisify');
const stringify = require('./stringify');

const writeFile = promisify(fs.writeFile);

/**
 * Save normalized declaration to target format
 *
 * @param   {String}    filename    Filename for save declaration
 * @param   {BemCell[]} cells       Normalized declaraions
 * @param   {Object}    [opts]      Addtional options
 * @param   {String}    [opts.format='v2'] The desired format
 * @param   {String}    [opts.exportType='cjs'] The desired type for export
 * @param   {Number}    [opts.mode=0o666] File mode
 * @returns {Promise.<undefined>}
 */
module.exports = (filename, cells, opts) => {
    const options = opts || {};
    const defaults = {
        format: 'v2',
        exportType: 'cjs'
    };

    const str = stringify(cells, Object.assign({}, defaults, opts));

    return writeFile(filename, str, { mode: options.mode });
}
