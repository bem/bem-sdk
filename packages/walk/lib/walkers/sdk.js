import fs from 'node:fs';
import path from 'node:path';

import BemFile from '@bem/sdk.file';
import createPreset from '@bem/sdk.naming.presets/create';
import createMatch from '@bem/sdk.naming.cell.match';

/**
 * Calls specified callback for each file or directory in specified directory.
 *
 * Each item is object with the following fields:
 * * {string} path — the absolute path to file or directory.
 * * {string} basename — the name of file or directory (the last portion of a path).
 * * {string} stem - the name without tech name (complex extention).
 * * {string} tech - the complex extention for the file or directory path.
 *
 * @param {string}   dirname — the path to directory.
 * @param {function} fn — the function that is called on each file or directory.
 * @param {function} callback — the callback function.
 */
const eachDirItem = (dirname, fn, callback) => {
    fs.readdir(dirname, (err, filenames) => {
        if (err) {
            if (err.code === 'ENOTDIR') {
                return callback();
            }
            return callback(err);
        }

        const files = filenames.map(basename => path.join(dirname, basename));

        if (files.length === 0) {
            return callback();
        }

        let completed = 0;
        let errored = false;

        for (const file of files) {
            fn(file, (err) => {
                if (errored) return;
                if (err) {
                    errored = true;
                    return callback(err);
                }
                if (++completed === files.length) {
                    callback();
                }
            });
        }
    });
};


/**
 * Plugin to scan nested levels.
 *
 * @param {object}        info        The info about scaned level.
 * @param {string}        info.path   The level path to scan.
 * @param {INamingConvention} info.naming
 * @param {function}      add         The function to provide info about found files.
 * @param {function}      callback    The callback function.
 */
const sdk = (info, add, callback) => {
    const conv = createPreset(info.naming || 'origin');
    const match = createMatch(conv);

    // Scan level
    deeperInDir(info.path, callback);

    function deeperInDir(dir, deeperCb) {
        eachDirItem(dir, (filepath, cb) => {
            const relPath = path.relative(info.path, filepath);
            const matchResult = match(relPath.replace(/\\/g, '/'));

            if (matchResult.cell) {
                if (!matchResult.rest) {
                    add(new BemFile({
                        cell: matchResult.cell,
                        level: info.path,
                        path: filepath
                    }));
                }
            } else if (matchResult.isMatch) {
                deeperInDir(filepath, cb);
                return;
            }

            cb();
        }, deeperCb);
    }
};

export default sdk;
