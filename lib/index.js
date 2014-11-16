var fs = require('fs'),
    path = require('path'),
    naming = require('bem-naming'),
    PassThrough = require('stream').PassThrough,
    sep = path.sep;

function set(obj, prop, value) {
    if (value === undefined) { return; }
    obj[prop] = value;
}

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

var join = require('path').join;

function defaultPath(self) {
    var result = join(self.level, self.block);
    if (self.elem) { result = join(result, '__' + self.elem); }
    if (self.modName) { result = join(result, '_' + self.modName); }
    return join(result, self.id + '.' + self.tech);
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

            if (notation && item.tech) {
                var obj = item.notation;

                obj.level = item.level;
                obj.tech = item.tech;
                obj.path = item.filename;
                obj.id = item.bemname;
                obj.bem = item.bemname;

                Object.defineProperty(obj, 'copy', {
                    get: function () {
                        return function (target) {
                        if (typeof target !== 'object') {
                            throw new Error('Target object should be instance of Object, not ' + typeof target);
                        }

                        var props = ['block', 'elem', 'modName', 'modVal'];

                        for (var i = 0; i < props.length; i++) {
                            var prop = props[i];
                            if (target[prop]) { break; }
                            set(target, prop, target[prop] || this[prop]);
                        }

                        target.tech = target.tech || this.tech;
                        target.level = target.level || this.level;
                        target.id = naming.stringify(target);
                        target.bem = naming.stringify(target);
                        target.path = defaultPath(target);

                        return target;
                        }
                    },
                    enumerable: false
                });

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
