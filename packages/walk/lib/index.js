'use strict';

const fs = require('fs');
const { Readable } = require('stream');
const each = require('async-each');
const deprecate = require('depd')('@bem/sdk.walk');

const namingCreate = require('@bem/sdk.naming.presets/create');
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
    const output = new Readable({ objectMode: true, read() {} });
    if (!levels || !levels.length) {
        process.nextTick(() => output.push(null));
        return output;
    }

    options || (options = {});

    const defaults = options.defaults || {};

    // Turn warning about old using old walkers in the next major
    defaults.scheme && deprecate('Please stop using old API');

    const levelConfigs = Object.entries(options.levels || {})
        .reduce((res, [level, config]) => {
            const realLevel = realpathOrError(level);
            if (typeof realLevel !== 'string') {
                console.error(`walk: Can't find '${level}' on the FS, need manual fix`);
                throw realLevel;
            }

            res[level] = res[realLevel] = config;
            config.paths_ = new Set([level, realLevel]);

            return res;
        }, {});

    // Check levels, and fillup configs
    for (const level of levels) {
        if (levelConfigs[level]) {
            continue;
        }

        const realLevel = realpathOrError(level);
        if (typeof realLevel !== 'string') {
            process.nextTick(() => output.emit('error', realLevel));
            return output;
        }

        if (!levelConfigs[realLevel]) {
            levelConfigs[realLevel] = {paths_: new Set([level, realLevel])};
        } else {
            levelConfigs[realLevel].paths_.add(level);
        }
        levelConfigs[level] = levelConfigs[realLevel];
    }

    const defaultNaming = defaults.naming || {};
    const defaultScheme = defaultNaming.scheme || defaults.scheme;
    const defaultWalker = (typeof defaultScheme === 'string' ? walkers[defaultScheme] : defaultScheme) || walkers.sdk;

    const add = (obj) => output.push(obj);

    const scan = (level, callback) => {
        const config = levelConfigs[level] || {};
        const isLegacyScheme = 'scheme' in config;
        const userNaming = typeof config.naming === 'object'
            ? config.naming
            : {preset: config.naming || (isLegacyScheme ? 'legacy' : 'origin')};

        // Fallback for slowpokes
        if (config.scheme) {
            userNaming.fs || (userNaming.fs = {});
            userNaming.fs.scheme = config.scheme;
        }

        const naming = namingCreate(userNaming, defaultNaming);

        const scheme = config && config.scheme || naming.fs && naming.fs.scheme;

        // TODO: Drop or doc custom function scheme support (?)
        const walker = (config.legacyWalker || isLegacyScheme)
            ? (typeof scheme === 'string' ? walkers[scheme] : (scheme || defaultWalker))
            : defaultWalker;

        walker({ path: level, naming: naming /* extend with defauls */ }, add, callback);
    };

    each(levels, scan, err => {
        err
            ? output.emit('error', err)
            : output.push(null);
    });

    return output;
};

function realpathOrError(path) {
    try {
        return fs.realpathSync(path);
    } catch (e) {
        return e;
    }
}

/**
 * Inline version of stream to array
 *
 * @returns {Promise<BemFile[]>}
 */
module.exports.asArray = function(...args) {
    return new Promise((resolve, reject) => {
        const files = [];
        module.exports(...args)
            .on('data', file => files.push(file))
            .on('error', reject)
            .on('end', () => resolve(files));
    });
};
