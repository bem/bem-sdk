'use strict';

const Readable = require('stream').Readable;
const each = require('async-each');

const walkers = require('./walkers');

/**
 * Scans levels in file system.
 *
 * If file or directory is valid BEM entity then `add` will be called with info about this file.
 *
 * @param {string[]} levels                The paths to levels.
 * @param {object} options                 The options.
 * @param {object} options.levels          The level map. A key is path to a level,
 *                                         a value is an options object for this level.
 * @param {object} options.defaults        The options for levels by default.
 * @param {object} options.defaults.naming Any options for `@bem/naming`.
 * @param {string} options.defaults.scheme The name of level scheme. Available values: `flat` or `nested`.
 *
 * @returns {module:stream.Readable} stream with info about found files and directories.
 */
module.exports = (levels, options) => {
    options || (options = {});

    const defaults = options.defaults || {};
    const levelConfigs = options.levels || {};
    const defaultNaming = defaults.naming;
    const defaultWalker = (typeof defaults.scheme === 'string' ? walkers[defaults.scheme] : defaults.scheme)
        || walkers.nested;

    const output = new Readable({ objectMode: true, read: () => {} });
    const add = (obj) => output.push(obj);

    const scan = (level, callback) => {
        const config = levelConfigs[level];
        const scheme = config && config.scheme;
        const naming = config && config.naming || defaultNaming;
        const walk = typeof scheme === 'string' ? walkers[scheme] : (scheme || defaultWalker);

        walk({ path: level, naming: naming }, add, callback);
    };

    each(levels, scan, err => {
        err
            ? output.emit('error', err)
            : output.push(null);
    });

    return output;
};
