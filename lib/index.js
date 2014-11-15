var fs = require('fs'),
    path = require('path'),
    naming = require('bem-naming'),
    object = require('bem-object'),
    PassThrough = require('readable-stream').PassThrough,
    sep = path.sep;

function nested(item, add, walk, done) {
    var basename = item.basename,
        filename = item.filename,
        parent = path.basename(item.dirname),
        grandParent = path.basename(path.dirname(item.dirname)),
        depth = filename.split(sep).length - item.level.split(sep).length;

    if ((depth === 1 && naming.isBlock(item.notation)) ||
        (depth === 2 && naming.isBlockMod(parent + basename)) ||
        (depth === 2 && naming.isElem(parent + basename)) ||
        (depth === 3 && naming.isElemMod(grandParent + parent + basename))
    ) {
        return walk(filename, done);
    }

    add(item);
    done();
}

module.exports = function (levels) {
    var output = new PassThrough({ objectMode: true });

    function scan(level, callback) {
        var entities = {};

        walk(level, callback);

        function walk(dir, callback) {
            fs.readdir(dir, function (err, items) {
                if (err) { return; }

                var n = 0,
                    l = items.length;

                for (var i = 0; i < l; ++i) {
                    var basename = items[i],
                        filename = path.join(dir, basename),
                        splited = basename.split('.'),
                        bemname = splited.shift();

                    nested({
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

            if (notation) {
                output.write(object(level + '/' + item.basename));
            }
        }
    }

    var n = 0,
        l = levels.length;

    levels.forEach(function (level) {
        scan(level, function (err) {
            if (err) {
                output.emit('error', err);
            }

            ++n === l && output.end();
        });
    });

    return output;
};
