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
 * @param {String} [options.pathToConfig] custom path to config on FS via command line argument `--config`
 * @constructor
 */
function BemConfig(options) {
    this._options = options || {};
    this._options.projectRoot || (this._options.projectRoot = process.cwd());
}

/**
 * Returns all found configs
 * @param {Boolean} isSync - flag to resolve configs synchronously
 * @returns {Promise|Array}
 */
BemConfig.prototype.configs = function(isSync) {
    const options = this._options;
    const projectRoot = options.projectRoot;

    const rcOpts = {
        name: options.name || 'bem',
        defaults: options.config && JSON.parse(JSON.stringify(options.config)),
        projectRoot: projectRoot,
        fsRoot: options.fsRoot,
        fsHome: options.fsHome
    };

    if (options.pathToConfig) {
        rcOpts.argv = { config: options.pathToConfig };
    }

    const readConfigs = rc(rcOpts);

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

    if (isSync) {
        return readConfigs.map(config => {
            if (config.levels) {
                Object.keys(config.levels).forEach(wildcardLevel => {
                    glob.sync(wildcardLevel, { cwd: projectRoot })
                        .forEach(createProcessConfigFunc(config, wildcardLevel));
                    delete config.levels[wildcardLevel];
                });
            }

            return config;
        });
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
 * Returns merged config synchronously
 * @returns {Object}
 */
BemConfig.prototype.getSync = function() {
    return Object.assign.apply(Object, [{}].concat(this.configs(true)));
};

function getLevelByConfigs(levelPath, options, allConfigs) {
    const absLevelPath = path.resolve(options.projectRoot, levelPath);
    let levelOpts = { __source: absLevelPath };

    for (let i = 0; i < allConfigs.length; i++) {
        let conf = allConfigs[i];
        let levels = conf.levels || {};

        Object.assign(levelOpts, conf);

        for (let level in levels) {
            if (level !== absLevelPath) { continue; }

            // works like deep extend but overrides arrays
            levelOpts = _.mergeWith({}, levels[level], levelOpts,
                (objValue, srcValue) => {
                if (Array.isArray(objValue)) {
                    return srcValue;
                }
            });
        }

        if (conf.root) { break; }
    }

    delete levelOpts.__source;
    delete levelOpts.levels;
    delete levelOpts.root;

    return !_.isEmpty(levelOpts) ? levelOpts : undefined;
}

/**
 * Resolves config for given level
 * @param {String} levelPath - level path
 * @returns {Promise}
 */
BemConfig.prototype.level = function(levelPath) {
    return this.configs().then(allConfigs => getLevelByConfigs(levelPath, this._options, allConfigs));
};

/**
 * Resolves config for given level synchronously
 * @param {String} levelPath - level path
 * @returns {Object}
 */
BemConfig.prototype.levelSync = function(levelPath) {
    return getLevelByConfigs(levelPath, this._options, this.configs(true));
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
 * Returns config for given library synchronously
 * @param {String} libName - library name
 * @returns {Object}
 */
BemConfig.prototype.librarySync = function(libName) {
    return new BemConfig({ projectRoot: this.getSync().libs[libName].path });
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

/**
 * Returns map of settings for each of level synchronously
 * @returns {Object}
 */
BemConfig.prototype.levelMapSync = function() {
    const config = this.getSync();
    const projectLevels = config.levels;
    const libNames = config.libs ? Object.keys(config.libs) : [];
    const libLevels = libNames.map(libName => {
        const bemLibConf = this.librarySync(libName);
        const libConfig = bemLibConf.getSync();

        return libConfig.levels;
    });

    const allLevels = libLevels.concat(projectLevels);

    return _.merge.apply(this, allLevels);
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

/**
 * Returns config for given module name synchronously
 * @param {String} moduleName - name of module
 * @returns {Object}
 */
BemConfig.prototype.moduleSync = function(moduleName) {
    const modules = this.getSync().modules;

    return modules && modules[moduleName];
};

module.exports = options => new BemConfig(options);
