'use strict';

const defaultReader = require('./formats/deps.js/reader');

/**
 * Generic serial reader generator
 *
 * @param {function(f: BemFile): Promise<{file: BemFile, data: *, scope: BemEntityName}>} reader - Reads and evaluates BemFiles.
 * @returns {Function}
 */
module.exports = function read(reader) {
    reader || (reader = defaultReader);

    /**
     * Serially reads and evaluates BemFiles.
     *
     * @param {Array<BemFile>} files - file data to read
     * @returns {Promise<Array<{file: BemFile, data: *, scope: BemEntityName}>>} [description]
     */
    return function (files) {
        const res = [];
        const stack = [].concat(files);
        let i = 0;

        return new Promise(
            function next(resolve, reject) {
                if (i >= stack.length) {
                    resolve(res);
                    return;
                }

                const f = stack[i++];
                Promise.resolve(reader(f))
                    .then(fileWithData => res.push(fileWithData))
                    .then(() => next(resolve, reject))
                    .catch(reject);
            });
    };
};
