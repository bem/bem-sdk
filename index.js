Object.assign || (Object.assign = require('object-assign'));

var path = require('path'),
    rc = require('rc'),
    _ = require('lodash'),
    glob = require('glob');

function BemConfig(config) {
    var configs = rc('bem', config);

    this.configs = configs.map(function(config) {
        config.levels && (config.levels = config.levels.map(function(level) {
            return path.resolve(level);
        }));

        config.levelsOpts && Object.keys(config.levelsOpts).forEach(function(wildcardLevel) {
            glob.sync(wildcardLevel).forEach(function(level) {
                config.levelsOpts[path.resolve(level)] = config.levelsOpts[wildcardLevel];
            });

            delete config.levelsOpts[wildcardLevel];
        });

        return config;
    });

    this.merged = Object.assign.apply(Object, [{}].concat(configs));
};

BemConfig.prototype.getLevelOpts = function(levelPath) {
    var absLevelPath = path.resolve(levelPath),
        levelOpts = { __source: absLevelPath };

    for (var i = 0; i < this.configs.length; i++) {
        var conf = this.configs[i],
            levelsOpts = conf.levelsOpts || {};

        Object.assign(levelOpts, conf);

        for (var level in levelsOpts) {
            if (level === absLevelPath) {

                // works like deep extend but overrides arrays
                levelOpts = _.mergeWith({}, levelsOpts[level], levelOpts, function(objValue, srcValue) {
                    if (Array.isArray(objValue)) {
                        return srcValue;
                    }
                });
            }
        }

        if (conf.root) break;
    }

    delete levelOpts.__source;
    delete levelOpts.levelsOpts;
    delete levelOpts.root;

    if (!Object.keys(levelOpts).length) return;

    return levelOpts;
}

module.exports = BemConfig;
