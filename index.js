'use strict';

const path = require('path');
const _ = require('lodash');
const rc = require('./lib/rc');
const glob = require('glob');

function globPromise(pattern, options) {
    return new Promise((resolve, reject) => {
        glob(pattern, options, (err, results) => {
            err ? reject(err) : resolve(results);
        });
    });
}

/**
 * Constructor
 * @param {Object} [options] object
 * @param {String} [options.name='bem'] - config filename.
 * @param {String} [options.projectRoot=process.cwd()] project root directory.
 * @param {Object} [options.config={}] extends found configs with this object
 * @param {String} [options.argv] custom path to config on FS via command line argument `--config`
 * @constructor
 */
function BemConfig(options) {
    this._options = options || {};
    this._options.projectRoot || (this._options.projectRoot = process.cwd());
}

/**
 * Returns all found configs
 * @returns {Promise}
 */
BemConfig.prototype.configs = function() {
    const options = this._options;
    const projectRoot = options.projectRoot;

    const readConfigs = rc({
        name: options.name || 'bem',
        defaults: options.config,
        argv: options.argv,
        projectRoot
    });

    function createProcessConfigFunc(config, wildcardLevel) {
        return resolvedWildcards => {
            [].concat(resolvedWildcards).forEach((level, idx) => {
                if (wildcardLevel === path.resolve(level)) { return; }

                config.levels[path.resolve(projectRoot, level)] = config.levels[wildcardLevel];

                if (resolvedWildcards.length === idx + 1) {
                    delete config.levels[wildcardLevel];
                }
            });
            return config;
        };
    }

    return Promise.all(readConfigs.map(config => {
        return !config.levels ? config : Promise.all(Object.keys(config.levels).map(wildcardLevel => {
            return globPromise(wildcardLevel, { cwd: projectRoot })
                .then(createProcessConfigFunc(config, wildcardLevel));
        }))
        .then(() => config);
    }));
};

/**
 * Returns merged config
 * @returns {Promise}
 */
BemConfig.prototype.get = function() {
    return this.configs()
        .then(all => Object.assign.apply(Object, [{}].concat(all)));
};

/**
 * Resolves config for given level
 * @param {String} levelPath - level path
 * @returns {Promise}
 */
BemConfig.prototype.level = function(levelPath) {
    const absLevelPath = path.resolve(this._options.projectRoot, levelPath);
    let levelOpts = { __source: absLevelPath };

    return this.configs().then(all => {
        for (let i = 0; i < all.length; i++) {
            let conf = all[i];
            let levels = conf.levels || {};

            Object.assign(levelOpts, conf);

            for (let level in levels) {
                if (level === absLevelPath) {

                    // works like deep extend but overrides arrays
                    levelOpts = _.mergeWith({}, levels[level], levelOpts, (objValue, srcValue) => {
                        if (Array.isArray(objValue)) {
                            return srcValue;
                        }
                    });
                }
            }

            if (conf.root) { break; }
        }

        delete levelOpts.__source;
        delete levelOpts.levels;
        delete levelOpts.root;

        return !_.isEmpty(levelOpts) ? levelOpts : undefined;
    });
};

/**
 * Returns config for given library
 * @param {String} libName - library name
 * @returns {Promise}
 */
BemConfig.prototype.library = function(libName) {
    return this.get()
        .then(config => new BemConfig({ projectRoot: config.libs[libName].path }));
};

/**
 * Returns map of settings for each of level
 * @returns {Promise}
 */
BemConfig.prototype.levelMap = function() {
    return this.get().then(config => {
        const projectLevels = config.levels;

        return Promise.all((config.libs ? Object.keys(config.libs) : []).map(libName => {
            return this.library(libName)
                .then(bemLibConf => bemLibConf.get())
                .then(libConfig => libConfig.levels);
        }))
        .then(libLevels => libLevels.concat(projectLevels))
        .then(allLevels => _.merge.apply(this, allLevels));
    });
};

    });
};

/**
 * Returns config for given module name
 * @param {String} moduleName - name of module
 * @returns {Promise}
 */
BemConfig.prototype.module = function(moduleName) {
    return this.get().then(config => {
        const modules = config.modules;

        return modules && modules[moduleName];
    });
};

module.exports = options => new BemConfig(options);
