'use strict';

var path = require('path'),
    isGlob = require('is-glob'),
    glob = require('glob'),
    _ = require('lodash'),
    merge = require('../lib/merge');

module.exports = function(config, configs, customLevelsConfig, options, cb) {
    var cwd = options.cwd || process.cwd(),
        source = config.__source,
        res = _.cloneDeep(config),
        levels = merge(res.levels, customLevelsConfig),
        levelsKeys = Object.keys(levels);

    if (!levelsKeys.length) { return cb ? cb(res) : res; }

    levelsKeys.forEach(function(globLevel) {
        if (!isGlob(globLevel)) {
            onLevel(globLevel, true);
            cb && cb(res);
            return;
        }

        if (!cb) { // sync
            var globbedLevels = glob.sync(globLevel, { cwd: cwd });

            globbedLevels.forEach(function(level, idx) {
                onLevel(level, globLevel, globbedLevels.length === idx - 1);
            });

            return;
        }

        // async
        glob(globLevel, { cwd: cwd }, function(err, asyncGlobbedLevels) {
            // TODO: if (err) { throw err; }
            asyncGlobbedLevels.forEach(function(level, idx) {
                onLevel(level, globLevel, asyncGlobbedLevels.length === idx - 1);
            });

            cb(res);
        });
    });

    return res;

    function onLevel(level, globLevel, needRemoveKey) {
        if (arguments.length === 2) {
            needRemoveKey = globLevel;
            globLevel = level;
        }

        var resolvedLevel = path.resolve(source ? path.dirname(source) : cwd, level);

        if (resolvedLevel === level) { return; }

        merge(levels[resolvedLevel] || (levels[resolvedLevel] = {}), levels[globLevel]);

        needRemoveKey && delete levels[globLevel];
    }
};
