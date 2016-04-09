'use strict';

const fs = require('fs');
const path = require('path');
const bemNaming = require('bem-naming');
const Readable = require('stream').Readable;
const schemes = require('./schemes');

module.exports = function (levels, bemconfig) {
    bemconfig || (bemconfig = {});

    const output = new Readable({ objectMode: true });
    const defaults = bemconfig.defaults || {};
    const levelConfigs = bemconfig.levels || {};
    const defaultNaming = defaults.naming ? bemNaming(defaults.naming) : bemNaming;
    const defaultScheme = (typeof defaults.scheme === 'string' ? schemes[defaults.scheme] : defaults.scheme)
        || schemes.nested;

    levels = levels.map(levelname => {
        let scheme, naming;

        const config = levelConfigs[levelname];

        if (config) {
            scheme = config.scheme;
            naming = config.naming;
        }

        return {
            path: levelname,
            walk: typeof scheme === 'string' ? schemes[scheme] : (scheme || defaultScheme),
            naming: naming ? bemNaming(naming) : defaultNaming
        };
    });

    function add(obj) {
        output.push(obj);
    }

    function scan(level, callback) {
        const levelname = level.path;
        const step = level.walk(levelname, level.naming);

        walk(levelname, 1, null, callback);

        function walk(dir, depth, data, callback) {
            fs.readdir(dir, (err, items) => {
                if (err) { return callback(err); }

                let n = 0;
                let l = items.length;

                if (l === 0) {
                    callback();
                } else {
                    for (let i = 0; i < l; ++i) {
                        const basename = items[i];
                        const filename = path.join(dir, basename);

                        step({
                            basename: basename,
                            dirname: dir,
                            filename: filename,
                            depth: depth,
                            data: data
                        }, add, deepWalk, next);
                    }
                }

                function deepWalk(dir, data) {
                    walk(dir, depth + 1, data, next);
                }

                function next(err) {
                    err && callback(err);

                    ++n === l && callback();
                }
            });
        }
    }

    let n = levels.length;

    output._read = function () {
        n || output.push(null);

        levels.length && scan(levels.shift(), err => {
            err && output.emit('error', err);
            --n || output.push(null);
        });
    };

    return output;
};
