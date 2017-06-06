'use strict';

const fsp = require('mz/fs');
const _eval = require('node-eval');

/**
 * Reads and evaluates BemFiles.
 *
 * @param {BemFile} f - file data to read
 * @returns {Promise<{file: BemFile, data: *, scope: BemEntityName}>}
 */
module.exports = function read(f) {
    return fsp.readFile(f.path, 'utf8')
        .then(content => Object.assign(f, {
            data: _eval(content, f.path)
        }));
};
