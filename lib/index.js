var fs = require('fs'),
    path = require('path'),
    bemNaming = require('bem-naming'),
    PassThrough = require('stream').PassThrough,
    schemes = require('./schemes');

module.exports = function (levels, options) {
    options || (options = {});

    var output = new PassThrough({ objectMode: true }),
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
        output.write(obj);
    }

    function scan(level, callback) {
        var step = level.scheme(level.path, level.naming);

        walk(level.path, callback);

        function walk(dir, callback) {
            fs.readdir(dir, function (err, items) {
                if (err) return callback(err);

                var n = 0,
                    l = items.length;

                for (var i = 0; i < l; ++i) {
                    var basename = items[i],
                        filename = path.join(dir, basename);

                    step({
                        basename: basename,
                        dirname: dir,
                        filename: filename
                    }, add, walk, next);
                }

                function next(err) {
                    err && callback(err);

                    ++n === l && callback(null);
                }
            });
        }
    }

    var n = 0,
        l = levels.length;

    if (l === 0) {
        output.end();
    } else {
        for (var i = 0; i < l; ++i) {
            scan(levels[i], scancb);
        }
    }

    function scancb(err) {
        err && output.emit('error', err);

        ++n === l && output.end();
    }

    return output;
};
