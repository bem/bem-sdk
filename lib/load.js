'use strict';

const fs = require('graceful-fs');
const promisify = require('es6-promisify');

const parse = require('./parse');

const readFile = promisify(fs.readFile);

/**
 * Read file and call parse on its content
 *
 * @param  {String} filePath path to file
 * @param  {Object} opts     additional options
 * @return {Promise}
 */
module.exports = (filePath, opts) => readFile(filePath, opts || 'utf-8').then(parse);
