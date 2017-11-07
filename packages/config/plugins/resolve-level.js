'use strict';

var path = require('path'),
    isGlob = require('is-glob'),
    glob = require('glob'),
    cloneDeep = require('lodash.clonedeep'),
    merge = require('../lib/merge');

module.exports = function(config, configs, options, cb) {
    var cwd = options.cwd || process.cwd(),
        source = config.__source,
        res = cloneDeep(config),
        levels = res.levels || [],
        levelsIndex = {},
        cyclesToResolve = levels.length;

    if (!cyclesToResolve) { return cb ? cb(res) : res; }

    var pathsToRemove = [];

    levels.forEach(function(level, i) {
        cyclesToResolve--;
        levelsIndex[level.path] = i;

        if (!isGlob(level.path)) {
            onLevel(level.path);
            path.isAbsolute(level.path) || pathsToRemove.push(level.path);

            if (!cyclesToResolve && cb) {
                removeRelPaths();
                cb(res);
            }

            return;
        }

        if (!cb) { // sync
            var globbedLevels = glob.sync(level.path, { cwd: cwd });
            globbedLevels.forEach(function(levelPath, idx) {
                onLevel(levelPath, level.path);
                globbedLevels.length - 1 === idx && pathsToRemove.push(level.path);
            });

            return;
        }

        // async
        glob(level.path, { cwd: cwd }, function(err, asyncGlobbedLevels) {
            // TODO: if (err) { throw err; }
            asyncGlobbedLevels.forEach(function(levelPath, idx) {
                onLevel(levelPath, level.path);
                asyncGlobbedLevels.length - 1 === idx && pathsToRemove.push(level.path);
            });

            if (!cyclesToResolve) {
                removeRelPaths();

                cb(res);
            }
        });
    });

    cb || removeRelPaths();

    return res;

    function onLevel(levelPath, globLevelPath) {
        globLevelPath || (globLevelPath = levelPath);

        var resolvedLevel = path.resolve(source ? path.dirname(source) : cwd, levelPath);

        if (resolvedLevel === levelPath && levelPath === globLevelPath) { return; }

        if (levelsIndex[resolvedLevel] === undefined) {
            levelsIndex[resolvedLevel] = levels.push({ path: resolvedLevel }) - 1;
        }

        merge(levels[levelsIndex[resolvedLevel]],
            Object.assign({}, levels[levelsIndex[globLevelPath]], { path: undefined }));
    }

    function removeRelPaths() {
        pathsToRemove.forEach((pathToRemove, shiftIdx) => {
            levels.splice(levelsIndex[pathToRemove] - shiftIdx, 1);
            levelsIndex[pathToRemove] = undefined;
        });
    }
};
