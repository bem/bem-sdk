var fs = require('fs'),
    path = require('path'),
    naming = require('bem-naming'),
    EventEmitter = require('events').EventEmitter,
    sep = path.sep;

function nested(item, add, walk, done) {
    var basename = item.basename,
        filename = item.filename,
        parent = path.basename(item.dirname),
        depth = filename.split(sep).length - item.level.split(sep).length;

    if ((depth === 1 && naming.isBlock(item.notation)) ||
        (depth === 2 && naming.isBlockMod(parent + basename)) ||
        (depth === 2 && naming.isElem(parent + basename)) ||
        (depth === 3 && naming.isElemMod(parent + basename))
    ) {
        return walk(filename, done);
    }

    add(item, done);
}

function scan(level, opts, callback) {
    if (!callback) {
        callback = opts;
        opts = {};
    }

    var step = opts.step || nested,
        entities = {};

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

                step({
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

    function add(item, done) {
        var notation = item.notation;

        if (notation) {
            var filename = item.filename;

            fs.stat(filename, function (err, stat) {
                if (err) { return done(err); }

                var bemname = item.bemname,
                    info = {
                        basename: item.basename,
                        filename: filename,
                        stat: stat,
                        tech: item.tech
                    },
                    entity = (entities[bemname] || (entities[bemname] = { files: [], dirs: [] }));

                (stat.isDirectory() ? entity.dirs : entity.files).push(info);

                done();
            });
        } else {
            done();
        }
    }
}

module.exports = function () {
    var emitter = new EventEmitter();

    scan();

    return emitter;
};
