import fs from 'node:fs';
import assert from 'node:assert';
import path from 'node:path';
import { cosmiconfigSync } from 'cosmiconfig';
import merge from './lib/merge.js';
import resolveSets from './lib/resolve-sets.js';
import resolveLevel from './plugins/resolve-level.js';

const basePlugins = [resolveLevel];

const specialKeys = new Set(['sets', 'levels', 'libs', 'modules', '__source']);

/**
 * Loads configs as an array, mimicking betterc behavior:
 * - defaults come first
 * - found RC config(s) in the middle
 * - extendBy at the end
 *
 * @param {Object} rcOpts
 * @returns {Array}
 */
function loadConfigs(rcOpts) {
    const configs = [];

    if (rcOpts.defaults) {
        configs.push(JSON.parse(JSON.stringify(rcOpts.defaults)));
    }

    if (rcOpts.argv && rcOpts.argv.config) {
        // Load specific config file
        const configPath = path.resolve(rcOpts.argv.config);
        const content = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        content.__source = configPath;
        configs.push(content);
    } else {
        const explorer = cosmiconfigSync(rcOpts.name || 'bem', {
            searchPlaces: [
                `.${rcOpts.name || 'bem'}rc`,
                `.${rcOpts.name || 'bem'}rc.json`,
                `.${rcOpts.name || 'bem'}rc.js`,
            ],
            stopDir: rcOpts.fsRoot
        });
        const result = explorer.search(rcOpts.cwd);
        if (result && result.config) {
            const config = result.config;
            config.__source = result.filepath;
            configs.push(config);
        }
    }

    if (rcOpts.extendBy) {
        configs.push(typeof rcOpts.extendBy === 'string'
            ? JSON.parse(rcOpts.extendBy)
            : JSON.parse(JSON.stringify(rcOpts.extendBy)));
    }

    if (configs.length === 0) {
        configs.push({});
    }

    return configs;
}

/**
 * Constructor
 * @param {Object} [options] object
 * @param {String} [options.name='bem'] - config filename.
 * @param {String} [options.cwd=process.cwd()] project root directory.
 * @param {Object} [options.defaults={}] use this object as fallback for found configs
 * @param {String} [options.pathToConfig] custom path to config on FS via command line argument `--config`
 * @constructor
 */
function BemConfig(options) {
    this._options = options || {};
    // TODO: use cwd for resolver
    this._options.cwd || (this._options.cwd = process.cwd());
    // TODO: use cache
    // this._cache = {};
}

/**
 * Returns all found configs
 *
 * @param {boolean} [isSync=false] - flag to resolve configs synchronously
 * @returns {Promise|Array}
 */
BemConfig.prototype.configs = function(isSync) {
    const options = this._options;
    const cwd = options.cwd;
    const rcOpts = {
        defaults: options.defaults,
        cwd: cwd,
        fsRoot: options.fsRoot,
        fsHome: options.fsHome,
        name: options.name || 'bem',
        extendBy: options.extendBy
    };

    if (options.pathToConfig) {
        rcOpts.argv = { config: options.pathToConfig };
    }

    const plugins = [].concat(basePlugins, options.plugins || []);

    if (isSync) {
        const configs = doSomeMagicProcedure(this._configs || (this._configs = loadConfigs(rcOpts)), cwd);

        this._root = getConfigsRootDir(configs);

        return plugins.reduce(function(acc, plugin) {
            return acc.map(function(config) {
                return plugin(config, acc, options);
            });
        }, configs);
    }

    // Async path: loadConfigs is actually sync (cosmiconfig), but we wrap in Promise for API compat
    const _this = this;
    const _thisConfigs = this._configs || (this._configs = loadConfigs(rcOpts));

    return Promise.resolve(_thisConfigs).then(function(cfgs) {
        doSomeMagicProcedure(cfgs, cwd);

        _this._root = getConfigsRootDir(cfgs);

        return plugins.reduce(
            function(cfgsPromise, plugin) {
                return cfgsPromise.then(function(configs_) {
                    return Promise.all(configs_.map(function(config) {
                        return new Promise(function(resolve) {
                            plugin(config, configs_, options, resolve);
                        });
                    }));
                });
            },
            Promise.resolve(cfgs));
    });
};

/**
 * Returns project root
 * @returns {Promise<string>}
 */
BemConfig.prototype.root = async function() {
    if (!this._root) {
        await this.configs();
    }

    return this._root;
};

/**
 * Returns merged config
 * @returns {Promise}
 */
BemConfig.prototype.get = async function() {
    return merge(await this.configs());
};

/**
 * Resolves config for given level
 * @param {String} pathToLevel - level path
 * @returns {Promise}
 */
BemConfig.prototype.level = function(pathToLevel) {
    const _this = this;

    return this.configs()
        .then(function(configs) {
            return getLevelByConfigs(
                pathToLevel,
                _this._options,
                configs,
                _this._root);
        });
};

/**
 * Returns config for given library
 * @param {String} libName - library name
 * @returns {Promise}
 */
BemConfig.prototype.library = function(libName) {
    return this.get()
        .then(function(config) {
            const libs = config.libs;
            const lib = libs && libs[libName];

            if (lib !== undefined && typeof lib !== 'object') {
                return Promise.reject('Invalid `libs` format');
            }

            const cwd = lib && lib.path || path.resolve('node_modules', libName);

            return fs.promises.access(cwd, fs.constants.F_OK)
                .then(() => cwd)
                .catch(() => { throw 'Library ' + libName + ' was not found at ' + cwd; });
        })
        .then(cwd => new BemConfig({ cwd: path.resolve(cwd) }));
};

/**
 * Returns map of settings for each of level
 * @returns {Promise}
 */
BemConfig.prototype.levelMap = function() {
    const _this = this;

    return this.get().then(function(config) {
        const projectLevels = config.levels || [];
        const libNames = config.libs ? Object.keys(config.libs) : [];
        const commonOpts = Object.keys(config)
            .filter(key => !specialKeys.has(key))
            .reduce((acc, key) => {
                acc[key] = config[key];

                return acc;
            }, {});

        return Promise.all(libNames.map(function(libName) {
            return _this.library(libName).then(function(bemLibConf) {
                return bemLibConf.get().then(function(libConfig) {
                    return libConfig.levels;
                });
            });
        })).then(function(libLevels) {
            const allLevels = [].concat.apply([], libLevels.filter(Boolean)).concat(projectLevels);

            return allLevels.reduce((res, lvl) => {
                res[lvl.path] = merge({}, commonOpts, res[lvl.path] || {}, lvl);
                return res;
            }, {});
        });
    });
};

BemConfig.prototype.levels = function(setName) {
    const _this = this;

    return this.get().then(function(config) {
        const levels = config.levels || [];
        const sets = config.sets || {};

        if (!sets[setName]) { return []; }

        const resolvedSets = resolveSets(sets);
        const set = resolvedSets[setName];

        if (!set || !set.length) { return []; }

        return _this.levelMap().then(levelsMap => {
            // TODO: uniq
            return Promise.all(set.map(chunk => {
                if (chunk.library) {
                    return _this.library(chunk.library).then(libConfig => {
                        assert(libConfig, 'Library `' + chunk.library + '` was not found');

                        return libConfig.get().then(libConfigData => {
                            if (config.__source === libConfigData.__source) {
                                console.log('WARN: no config was found in `' + chunk.library + '` library');
                                return [];
                            }

                            return libConfig.levels(chunk.set || setName);
                        });
                    });
                }

                if (chunk.set) {
                    return _this.levels(chunk.set);
                }

                return levels.reduce((acc, lvl) => {
                    if (lvl.layer !== chunk.layer) { return acc; }

                    const levelPath = lvl.path || calculateDefaultLevelPath(lvl);

                    levelsMap[levelPath] && acc.push(levelsMap[levelPath]);

                    return acc;
                }, []);
            }));
        }).then(arr => arr.flat());
    });
};

/**
 * Returns config for given module name
 * @param {String} moduleName - name of module
 * @returns {Promise}
 */
BemConfig.prototype.module = function(moduleName) {
    return this.get().then(function(config) {
        const modules = config.modules;

        return modules && modules[moduleName];
    });
};

/**
 * Returns project root
 * @returns {String}
 */
BemConfig.prototype.rootSync = function() {
    if (this._root) {
        return this._root;
    }

    this.configs(true);
    return this._root;
};

/**
 * Returns merged config synchronously
 * @returns {Object}
 */
BemConfig.prototype.getSync = function() {
    return merge(this.configs(true));
};

/**
 * Resolves config for given level synchronously
 * @param {String} pathToLevel - level path
 * @returns {Object}
 */
BemConfig.prototype.levelSync = function(pathToLevel) {
    // TODO: cache
    return getLevelByConfigs(
        pathToLevel,
        this._options,
        this.configs(true),
        this._root);
};

/**
 * Returns config for given library synchronously
 * @param {String} libName - library name
 * @returns {Object}
 */
BemConfig.prototype.librarySync = function(libName) {
    const config = this.getSync();
    const libs = config.libs;
    const lib = libs && libs[libName];

    assert(lib === undefined || typeof lib === 'object', 'Invalid `libs` format');

    const cwd = lib && lib.path || path.resolve('node_modules', libName);

    assert(fs.existsSync(cwd), 'Library ' + libName + ' was not found at ' + cwd);

    return new BemConfig({ cwd: path.resolve(cwd) });
};

/**
 * Returns map of settings for each of level synchronously
 * @returns {Object}
 */
BemConfig.prototype.levelMapSync = function() {
    const config = this.getSync();
    const projectLevels = config.levels || [];
    const libNames = config.libs ? Object.keys(config.libs) : [];

    const libLevels = [].concat.apply([], libNames.map(function(libName) {
        const bemLibConf = this.librarySync(libName);
        const libConfig = bemLibConf.getSync();

        return libConfig.levels;
    }, this)).filter(Boolean);

    const commonOpts = Object.keys(config)
        .filter(key => !specialKeys.has(key))
        .reduce((acc, key) => {
            acc[key] = config[key];

            return acc;
        }, {});

    const allLevels = [].concat(libLevels, projectLevels); // hm.
    return allLevels.reduce(function(acc, level) {
        acc[level.path] = Object.assign({}, commonOpts, level);
        return acc;
    }, {});
};

BemConfig.prototype.levelsSync = function(setName) {
    const _this = this;
    const config = this.getSync();
    const levels = config.levels || [];
    const levelsMap = this.levelMapSync();
    const sets = config.sets || {};

    if (!sets[setName]) { return []; }

    const resolvedSets = resolveSets(sets);
    const set = resolvedSets[setName];

    // TODO: uniq
    return set.reduce((acc, chunk) => {
        if (chunk.library) {
            const libConfig = _this.librarySync(chunk.library);

            assert(libConfig, 'Library `' + chunk.library + '` was not found');

            if (config.__source === libConfig.getSync().__source) {
                console.error('WARN: no config was found in `' + chunk.library + '` library');
                return [];
            }

            return acc.concat(libConfig.levelsSync(chunk.set));
        }

        if (chunk.set) {
            return acc.concat(_this.levelsSync(chunk.set));
        }

        levels.forEach(lvl => {
            if (lvl.layer !== chunk.layer) { return; }

            const levelPath = lvl.path || calculateDefaultLevelPath(lvl);

            levelsMap[levelPath] && acc.push(levelsMap[levelPath]);
        });

        return acc;
    }, []);
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

function getConfigsRootDir(configs) {
    const rootCfg = [].concat(configs).reverse().find(function(cfg) { return cfg.root && cfg.__source; });
    if (rootCfg) { return path.dirname(rootCfg.__source); }
}

function getLevelByConfigs(pathToLevel, options, allConfigs, root) {
    const absLevelPath = path.resolve(root || options.cwd, pathToLevel);
    let levelOpts = {};
    let commonOpts = {};

    for (let i = allConfigs.length - 1; i >= 0; i--) {
        const conf = allConfigs[i];
        const levels = conf.levels || [];

        commonOpts = merge({}, conf, commonOpts);

        for (let j = 0; j < levels.length; j++) {
            const level = levels[j];

            if (level === undefined || level.path !== absLevelPath) { continue; }

            // works like deep extend but overrides arrays
            levelOpts = merge({}, level, levelOpts);
        }

        if (conf.root) { break; }
    }

    levelOpts = merge(commonOpts, levelOpts);

    delete levelOpts.__source;
    delete levelOpts.path;
    delete levelOpts.levels;
    delete levelOpts.root;

    return Object.keys(levelOpts).length ? levelOpts : undefined;
}

/**
 * Modifies passed configs set — adds path property if empty
 *
 * @param {Array<{layer: String, path: ?String}>} configs
 * @param {String} cwd
 * @returns {Array<{layer: String, path: String}>}
 */
function doSomeMagicProcedure(configs, cwd) {
    let levels;

    configs.forEach(config => {
        levels = config.levels;

        if (!levels) { return; }

        if (!Array.isArray(levels)) {
            config.levels = Object.keys(levels).map(levelPath => Object.assign({ path: levelPath }, levels[levelPath]));
        } else {

            let levelPrefix = '';
            if (config.__source && path.dirname(config.__source) !== cwd) {
                levelPrefix = path.relative(path.dirname(config.__source), cwd);
            }

            // FIXME: use `@bem/sdk.file.naming`
            levels.forEach(level => level.path || (level.path = path.join(levelPrefix, level.layer + '.blocks')));
        }
    });

    return configs;
}

function calculateDefaultLevelPath(lvl) {
    // TODO: Use `@bem/sdk.naming.file.stringify`
    return `${lvl.layer}.blocks`;
}

export default function(opts) {
    return new BemConfig(opts);
}
