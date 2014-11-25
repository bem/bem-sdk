var fs = require('fs'),
    path = require('path'),
    naming = require('bem-naming'),
    PassThrough = require('stream').PassThrough,
    schemes = require('../schemes');

module.exports = function (levels, opts) {
    var output = new PassThrough({ objectMode: true });

    opts || (opts = {});
    opts.naming && (naming = naming(opts.naming));

    var scheme = typeof opts.scheme === 'string' ? schemes[opts.scheme] : opts.scheme || schemes.nested;

    function scan(level, callback) {
        var entities = {};

        walk(level, callback);

        function walk(dir, callback) {
            fs.readdir(dir, function (err, items) {
                if (err) return callback(err);

                var n = 0,
                    l = items.length;

                for (var i = 0; i < l; ++i) {
                    var basename = items[i],
                        filename = path.join(dir, basename),
                        splited = basename.split('.'),
                        bemname = splited.shift();

                    scheme({
                        level: level,
                        basename: basename,
                        bemname: bemname,
                        dirname: dir,
                        filename: filename,
                        notation: naming.parse(bemname),
                        tech: splited.join('.')
                    }, add, walk, done);
                }

                function done(err) {
                    err && callback(err);

                    ++n === l && callback(null, entities);
                }
            });
        }

        function add(item) {
            var notation = item.notation;

            if (notation && item.tech) {
                var obj = item.notation;

                obj.level = item.level;
                obj.tech = item.tech;
                obj.path = item.filename;

                output.write(obj);
            }
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
        if (err) {
            output.emit('error', err);
        }

        ++n === l && output.end();
    }

    return output;
};
