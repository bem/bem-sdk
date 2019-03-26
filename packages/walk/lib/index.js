'use strict';

const { Readable } = require('stream');
const each = require('async-each');
const deprecate = require('depd')('@bem/sdk.walk');

const Config = require('@bem/sdk.config');
const namingCreate = require('@bem/sdk.naming.presets/create');
const walkers = require('./walkers');

const legacycallLayerName = 'legacycall';

/**
 * Legacy callback for walker.
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
    if (!levels || !levels.length) {
        const output = new Readable({ objectMode: true, read() {} });
        output.push(null);
        return output;
    }

    const config = {...(options || {})};
    const defaults = config.defaults = {...(config.defaults || {})}; // eslint-disable-line

    defaults.sets = {...(defaults.sets || {})};

    if (!defaults.levels) {
        defaults.levels = config.levels
            ? Object.entries(config.levels).map(([path, level]) => ({layer: legacycallLayerName, ...level, path}))
            : levels.map(level => ({ path: level, layer: legacycallLayerName }));
        defaults.sets.legacycall = [...new Set(defaults.levels.map(({layer}) => layer))].join(' ');
    }

    // Turn warning about old using old walkers in the next major
    defaults.scheme && deprecate('Please stop using old API');

    // ?
    // const defaultNaming = defaults.naming || {};
    // const defaultScheme = defaultNaming.scheme || defaults.scheme;
    // const defaultWalker = (typeof defaultScheme === 'string' ? walkers[defaultScheme] : defaultScheme) || walkers.sdk;

    return module.exports.walk({ sets: legacycallLayerName, config });
};

// TODO: V KONFIG
Config.create = function(config) {
    return config instanceof Config ? config : new Config(config);
};

/**
 * Scans levels in file system.
 *
 * If file or directory is valid BEM entity then `add` will be called with info about this file.
 *
 * @param {object} options
 * @param {string} [options.sets] - space delimited string of layer set names
 * @param {string|string[]} [options.levels]
 * @param {IBemConfig} [options.config]
 *
 * @returns {module:stream.Readable} stream with info about found files and directories.
 */
module.exports.walk = ({ /*levels,*/ sets, config: userConfig }) => {
    const walkConfig = Config.create(userConfig);
    const output = new Readable({ objectMode: true, read() {} });

    const levelConfigs = walkConfig.levelMapSync();

    // levels or sets ?
    const levelsForWalk = walkConfig.levels(sets);

    const add = (obj) => output.push(obj);

    const defaultWalker = walkers.sdk;

    const scan = (level, callback) => {
        const config = levelConfigs[level.path] || {};
        const isLegacyScheme = 'scheme' in config;
        const userNaming = typeof config.naming === 'object'
            ? config.naming
            : {preset: config.naming || (isLegacyScheme ? 'legacy' : 'origin')};

        // Fallback for slowpokes
        if (config.scheme) {
            userNaming.fs || (userNaming.fs = {});
            userNaming.fs.scheme = config.scheme;
        }

        const naming = namingCreate(userNaming);

        const scheme = config && config.scheme || naming.fs && naming.fs.scheme;

        // TODO: Drop or doc custom function scheme support (?)
        const walker = (config.legacyWalker || isLegacyScheme)
            ? (typeof scheme === 'string' ? walkers[scheme] : (scheme || defaultWalker))
            : defaultWalker;

        walker({ path: level.path, naming: naming /* extend with defauls */ }, add, callback);
    };

    // object[]
    levelsForWalk
        .then(levels => {
            each(levels, scan, err => {
                err
                    ? output.emit('error', err)
                    : output.push(null);
            });
        })
        .catch(error => output.emit('error', error));

    return output;
};

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
