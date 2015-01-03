var path = require('path'),
    sep = path.sep;

module.exports = function (level, naming) {
    return function (item, add, walk, next) {
        var basename = item.basename,
            filename = item.filename,
            parent = path.basename(item.dirname),
            grandParent = path.basename(path.dirname(item.dirname)),
            depth = filename.split(sep).length - level.split(sep).length;

        if ((depth === 1 && naming.isBlock(basename)) ||
            (depth === 2 && naming.isBlockMod(parent + basename)) ||
            (depth === 2 && naming.isElem(parent + basename)) ||
            (depth === 3 && naming.isElemMod(grandParent + parent + basename))
        ) {
            return walk(filename);
        }

        var splited = basename.split('.'),
            bemname = splited.shift(),
            notation = naming.parse(bemname),
            tech =  splited.join('.');

        if (notation && tech) {
            notation.level = level;
            notation.tech = tech;
            notation.path = filename;

            add(notation);
        }

        next();
    };
};
