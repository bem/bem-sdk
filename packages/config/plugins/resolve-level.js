import path from 'node:path';
import { globSync } from 'node:fs';
import merge from '../lib/merge.js';

const isGlob = s => /[*?{[\]]/.test(s.replace(/\\./g, ''));

export default function resolveLevel(config, configs, options, cb) {
    const cwd = options.cwd || process.cwd();
    const source = config.__source;
    const res = structuredClone(config);
    const levels = res.levels || [];
    const levelsIndex = {};
    let cyclesToResolve = levels.length;

    if (!cyclesToResolve) { return cb ? cb(res) : res; }

    const pathsToRemove = [];

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
            const globbedLevels = globSync(level.path, { cwd: cwd });
            globbedLevels.forEach(function(levelPath, idx) {
                onLevel(levelPath, level.path);
                globbedLevels.length - 1 === idx && pathsToRemove.push(level.path);
            });

            return;
        }

        // async — node:fs globSync is always sync, so use it here too
        // (the original used async glob; we simplify to sync and call cb)
        const asyncGlobbedLevels = globSync(level.path, { cwd: cwd });
        asyncGlobbedLevels.forEach(function(levelPath, idx) {
            onLevel(levelPath, level.path);
            asyncGlobbedLevels.length - 1 === idx && pathsToRemove.push(level.path);
        });

        if (!cyclesToResolve) {
            removeRelPaths();
            cb(res);
        }
    });

    cb || removeRelPaths();

    return res;

    function onLevel(levelPath, globLevelPath) {
        globLevelPath || (globLevelPath = levelPath);

        const resolvedLevel = path.resolve(source ? path.dirname(source) : cwd, levelPath);

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
}
