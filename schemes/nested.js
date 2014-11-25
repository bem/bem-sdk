var path = require('path'),
    sep = path.sep;

module.exports = function (item, add, walk, naming, done) {
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
};
