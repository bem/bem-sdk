'use strict';

var path = require('path'),
    isGlob = require('is-glob'),
    glob = require('glob');

module.exports = function(config, configs, options, cb) {
    var levels = config.levels,
        source = config.__source;

    if (!levels) { return cb && cb(); }

    Object.keys(levels).forEach(function(globLevel) {
        if (!isGlob(globLevel)) {
            onLevel(globLevel, true);
            return cb && cb();
        }

        if (!cb) { // sync
            var globbedLevels = glob.sync(globLevel, { cwd: options.cwd });

            return globbedLevels.forEach(function(level, idx) {
                onLevel(level, globLevel, globbedLevels.length === idx - 1);
            });
        }

        // async
        glob(globLevel, { cwd: options.cwd }, function(err, asyncGlobbedLevels) {
            // TODO: if (err) { throw err; }
            asyncGlobbedLevels.forEach(function(level, idx) {
                onLevel(level, globLevel, asyncGlobbedLevels.length === idx - 1);
            });

            cb();
        });
    });

    function onLevel(level, globLevel, needRemoveGlobKey) {
        if (typeof globLevel === 'boolean') {
            needRemoveGlobKey = globLevel;
            globLevel = level;
        }

        var resolvedLevel = source ?
                path.resolve(path.dirname(source), level) :
                path.resolve(options.cwd || process.cwd(), level); // TODO: bubble

        if (resolvedLevel === level) { return; }

        levels[resolvedLevel] = levels[globLevel];

        needRemoveGlobKey && delete levels[globLevel];
    }
};
