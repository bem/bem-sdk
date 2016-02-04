Object.assign || (Object.assign = require('object-assign'));

var path = require('path'),
    rc = require('./lib/rc'),
    mergeWith = require('lodash/mergeWith'),
    glob = require('glob');

function BemConfig(config) {
    var configs = rc('bem', config);

    this.configs = configs.map(function(config) {
        config.levels && Object.keys(config.levels).forEach(function(wildcardLevel) {
            var resolvedWildcards = glob.sync(wildcardLevel);

            resolvedWildcards.forEach(function(level, idx) {
                if (wildcardLevel === path.resolve(level)) return;

                config.levels[path.resolve(level)] = config.levels[wildcardLevel];

                if (resolvedWildcards.length === idx + 1) {
                    delete config.levels[wildcardLevel];
                }
            });
        });

        return config;
    });

    this.merged = Object.assign.apply(Object, [{}].concat(configs));
};

BemConfig.prototype.getLevel = function(levelPath) {
    var absLevelPath = path.resolve(levelPath),
        levelOpts = { __source: absLevelPath };

    for (var i = 0; i < this.configs.length; i++) {
        var conf = this.configs[i],
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
}

BemConfig.prototype.getPlugin = function(pluginName) {
    var plugins = this.merged.plugins;

    return plugins && plugins[pluginName];
}

module.exports = BemConfig;
