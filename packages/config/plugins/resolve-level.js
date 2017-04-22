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
        levelsIndex = {};

    if (!levels.length) { return cb ? cb(res) : res; }

    levels.forEach(function(level, i) {
        levelsIndex[level.path] = i;

        if (!isGlob(level.path)) {
            onLevel(level.path, true);
            cb && cb(res);
            return;
        }

        if (!cb) { // sync
            var globbedLevels = glob.sync(level.path, { cwd: cwd });
            globbedLevels.forEach(function(levelPath, idx) {
                onLevel(levelPath, level.path, globbedLevels.length - 1 === idx);
            });

            return;
        }

        // async
        glob(level.path, { cwd: cwd }, function(err, asyncGlobbedLevels) {
            // TODO: if (err) { throw err; }
            asyncGlobbedLevels.forEach(function(levelPath, idx) {
                onLevel(levelPath, level.path, asyncGlobbedLevels.length - 1 === idx);
            });

            cb(res);
        });
    });

    return res;

    function onLevel(levelPath, globLevelPath, needRemoveKey) {
        if (arguments.length === 2) {
            needRemoveKey = globLevelPath;
            globLevelPath = levelPath;
        }

        var resolvedLevel = path.resolve(source ? path.dirname(source) : cwd, levelPath);

        if (resolvedLevel === levelPath && levelPath === globLevelPath) { return; }

        if (levelsIndex[resolvedLevel] === undefined) {
            levelsIndex[resolvedLevel] = levels.push({ path: resolvedLevel }) - 1;
        }

        merge(levels[levelsIndex[resolvedLevel]],
            Object.assign({}, levels[levelsIndex[globLevelPath]], { path: undefined }));

        needRemoveKey && (levelsIndex[globLevelPath] = void levels.splice(levelsIndex[globLevelPath], 1));

    }
};
