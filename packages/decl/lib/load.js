import { readFile } from 'node:fs/promises';

import parse from './parse.js';

/**
 * Read file and call parse on its content
 *
 * @param  {String} filePath path to file
 * @param  {Object} opts     additional options
 * @return {Promise}
 */
export default (filePath, opts) => readFile(filePath, opts || 'utf-8').then(parse);
