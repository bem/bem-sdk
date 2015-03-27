var fs = require('fs'),
    path = require('path'),
    bemNaming = require('bem-naming'),
    Readable = require('stream').Readable,
    schemes = require('./schemes');

module.exports = function (levels, options) {
    options || (options = {});

    var output = new Readable({ objectMode: true }),
        defaultScheme = options.scheme || schemes.nested,
        defaultNaming = options.naming ? bemNaming(options.naming) : bemNaming;

    if (typeof defaultScheme === 'string') {
        defaultScheme = schemes[defaultScheme];
    }

    levels = levels.map(function (level) {
        var scheme = level && level.scheme,
            naming = level && level.naming;

        return {
            path: typeof level === 'string' ? level : level.path,
            scheme: typeof scheme === 'string' ? schemes[scheme] : (scheme || defaultScheme),
            naming: naming ? bemNaming(naming) : defaultNaming
        };
    });

    function add(obj) {
        output.push(obj);
    }

    function scan(level, callback) {
        var step = level.scheme(level.path, level.naming);

        walk(level.path, 1, null, callback);

        function walk(dir, depth, data, callback) {
            fs.readdir(dir, function (err, items) {
                if (err) return callback(err);

                var n = 0,
                    l = items.length;

                if (l === 0) {
                    callback();
                } else {
                    for (var i = 0; i < l; ++i) {
                        var basename = items[i],
                            filename = path.join(dir, basename);

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

    var n = levels.length;

    output._read = function () {
        n || output.push(null);

        levels.length && scan(levels.shift(), function (err) {
            err && output.emit('error', err);
            --n || output.push(null);
        });
    };

    return output;
};
