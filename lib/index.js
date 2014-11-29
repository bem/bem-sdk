var fs = require('fs'),
    path = require('path'),
    naming = require('bem-naming'),
    PassThrough = require('stream').PassThrough,
    schemes = require('./schemes');

module.exports = function (levels, opts) {
    opts || (opts = {});

    var output = new PassThrough({ objectMode: true }),
        levelNaming = opts.naming ? naming(opts.naming) : naming,
        scheme = typeof opts.scheme === 'string' ? schemes[opts.scheme] : opts.scheme || schemes.nested;

    function add(obj) {
        output.write(obj);
    }

    function scan(level, scheme, naming, callback) {
        var step = scheme(level, naming);

        walk(level, callback);

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
            scan(levels[i], scheme, levelNaming, scancb);
        }
    }

    function scancb(err) {
        err && output.emit('error', err);

        ++n === l && output.end();
    }

    return output;
};
