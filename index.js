Object.assign || (Object.assign = require('object-assign'));
var Promise = require('pinkie-promise');

var path = require('path'),
    rc = require('./lib/rc'),
    mergeWith = require('lodash/mergeWith'),
    glob = require('glob');

function BemConfig(options) {
    this._options = options || {};
};

BemConfig.prototype.getAll = function() {
    var options = this._options,
        projectRoot = options.projectRoot || process.cwd();

    return Promise.all(rc({
        name: options.name || 'bem',
        defaults: options.config,
        argv: options.argv,
        projectRoot: projectRoot
    })
    .map(function(config) {
        if (!config.levels) return config;

        return Promise.all(Object.keys(config.levels).map(function(wildcardLevel) {
            return new Promise(function(resolve, reject) {
                // replace wildcard levels with resolved onces
                // in the same config object by reference
                glob(wildcardLevel, { cwd: projectRoot }, function(err, resolvedWildcards) {
                    if (err) return reject(err);

                    resolvedWildcards.forEach(function(level, idx) {
                        if (wildcardLevel === path.resolve(level)) return;

                        config.levels[path.resolve(level)] = config.levels[wildcardLevel];

                        if (resolvedWildcards.length === idx + 1) {
                            delete config.levels[wildcardLevel];
                        }
                    });

                    resolve(config);
                });
            });
        })).then(function() {
            return config;
        });
    })).then(function(configs) {
        return {
            configs: configs,
            merged: Object.assign.apply(Object, [{}].concat(configs))
        };
    });
};

BemConfig.prototype.getConfig = function(levelPath) {
    return this.getAll().then(function(all) {
        var absLevelPath = path.resolve(levelPath),
            levelOpts = { __source: absLevelPath };

        for (var i = 0; i < all.configs.length; i++) {
            var conf = all.configs[i],
                levels = conf.levels || {};

            Object.assign(levelOpts, conf);

            for (var level in levels) {
                if (level === absLevelPath) {

                    // works like deep extend but overrides arrays
                    levelOpts = mergeWith({}, levels[level], levelOpts, function(objValue, srcValue) {
                        if (Array.isArray(objValue)) {
                            return srcValue;
                        }
                    });
                }
            }

            if (conf.root) break;
        }

        delete levelOpts.__source;
        delete levelOpts.levels;
        delete levelOpts.root;

        if (!Object.keys(levelOpts).length) return;

        return levelOpts;
    });
}

BemConfig.prototype.getModuleConfig = function(moduleName) {
    return this.getAll().then(function(all) {
        var modules = all.merged.modules;

        return modules && modules[moduleName];
    });
}

module.exports = function(options) {
    return new BemConfig(options);
};
