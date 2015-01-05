var path = require('path');

module.exports = function (level, naming) {
    return function (item, add, walk, next) {
        var basename = item.basename,
            filename = item.filename,
            depth = item.depth,
            splited = basename.split('.'),
            dirNotation, dirType;

        if (splited.length === 1) {
            var dirname = item.dirname,
                parent;

            if (depth === 1) {
                dirNotation = naming.parse(basename);
                dirType = naming.typeOf(dirNotation);

                if (dirType === 'block') {
                    return walk(filename, { notation: dirNotation, type: dirType });
                }
            } else if (depth === 2) {
                parent = path.basename(dirname);
                dirNotation = naming.parse(parent + basename);
                dirType = naming.typeOf(dirNotation);

                if (dirType === 'blockMod' || dirType === 'elem') {
                    return walk(filename, { notation: dirNotation, type: dirType });
                }
            } else if (depth === 3) {
                var grandParent = path.basename(path.dirname(dirname));

                parent = path.basename(dirname);
                dirNotation = naming.parse(grandParent + parent + basename);
                dirType = naming.typeOf(dirNotation);

                if (dirType === 'elemMod') {
                    return walk(filename, { notation: dirNotation, type: dirType });
                }
            }
        } else {
            if (depth > 1) {
                var data = item.data,
                    notation = naming.parse(splited.shift());

                dirNotation = data.notation;
                dirType = data.type;

                if (notation &&
                    (depth === 2 && dirNotation.block === notation.block) ||
                    (depth === 3 && dirType === 'elem' && dirNotation.block === notation.block &&
                        dirNotation.elem === notation.elem) ||
                    (depth === 3 && dirType === 'blockMod' && dirNotation.block === notation.block &&
                        dirNotation.modName === notation.modName) ||
                    (depth === 4 && dirNotation.block === notation.block && dirNotation.elem === notation.elem &&
                        dirNotation.modName === notation.modName)
                ) {
                    notation.level = level;
                    notation.tech = splited.join('.');
                    notation.path = filename;

                    add(notation);
                }
            }
        }

        next();
    };
};
