'use strict';

const path = require('path');
const rc = require('./lib/rc');
const mergeWith = require('lodash.mergewith');
const glob = require('glob');

function BemConfig(options) {
    this._options = options || {};
    this._options.projectRoot || (this._options.projectRoot = process.cwd());
}

BemConfig.prototype.configs = function() {
    const options = this._options;
    const projectRoot = options.projectRoot;

    return Promise.all(rc({
        name: options.name || 'bem',
        defaults: options.config,
        argv: options.argv,
        projectRoot
    })
    .map(function(config) {
        if (!config.levels) { return config; }

        return Promise.all(Object.keys(config.levels).map(wildcardLevel => {
            return new Promise((resolve, reject) => {
                // replace wildcard levels with resolved onces
                // in the same config object by reference

                glob(wildcardLevel, { cwd: projectRoot }, (err, resolvedWildcards) => {
                    if (err) { return reject(err); }

                    resolvedWildcards.forEach((level, idx) => {
                        if (wildcardLevel === path.resolve(level)) { return; }

                        config.levels[path.resolve(projectRoot, level)] = config.levels[wildcardLevel];

                        if (resolvedWildcards.length === idx + 1) {
                            delete config.levels[wildcardLevel];
                        }
                    });

                    resolve(config);
                });
            });
        })).then(() => config);
    }));
};

// merged config
BemConfig.prototype.get = function() {
    return this.configs()
        .then(all => Object.assign.apply(Object, [{}].concat(all)));
};

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
                    levelOpts = mergeWith({}, levels[level], levelOpts, (objValue, srcValue) => {
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

        if (!Object.keys(levelOpts).length) { return; }

        return levelOpts;
    });
};

BemConfig.prototype.library = function(libName) {
    return this.get().then(config => {
        return new BemConfig({ projectRoot: config.libs[libName].path });
    });
};

BemConfig.prototype.levelMap = function() {
    return this.get().then(config => {
        const projectLevels = config.levels;

        return Promise.all(Object.keys(config.libs).map(libName => {
            return this.library(libName)
                .then(bemLibConf => bemLibConf.get())
                .then(libConfig => libConfig.levels);
        }))
        .then(libLevels => libLevels.concat(projectLevels))
        .then(allLevels => {
            return allLevels.reduce((prev, levels) => {
                Object.keys(levels).forEach(level => {
                    prev[level] = levels[level];
                });

                return prev;
            }, {});
        });

    });
};

BemConfig.prototype.module = function(moduleName) {
    return this.get().then(config => {
        const modules = config.modules;

        return modules && modules[moduleName];
    });
}

module.exports = options => new BemConfig(options);
