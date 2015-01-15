var path = require('path');

module.exports = function (level, naming) {
    return function (item, add, walk, next) {
        var basename = item.basename,
            filename = item.filename,
            depth = item.depth,
            splited = basename.split('.'),
            parentData = item.data && item.data.parent,
            entity;

        if (splited.length === 1) {
            var dirname = item.dirname,
                needWalk = false,
                type;

            if (depth === 1) {
                entity = naming.parse(basename);
                type = naming.typeOf(entity);

                needWalk = type === 'block';
            } else if (depth === 2) {
                entity = naming.parse(parentData.basename + basename);
                type = naming.typeOf(entity);

                needWalk = type === 'blockMod' || type === 'elem';
            } else if (depth === 3) {
                entity = naming.parse(path.basename(parentData.dirname) + parentData.basename + basename);
                type = naming.typeOf(entity);

                needWalk = type === 'elemMod';
            }

            if (needWalk) {
                return walk(filename, { parent: {
                    entity: entity,
                    type: type,
                    dirname: dirname,
                    basename: basename
                } });
            }
        } else {
            if (depth > 1) {
                var parentEntity = parentData.entity,
                    parentEntityType = parentData.type;

                entity = naming.parse(splited.shift());

                if (entity &&
                    ((depth === 2 && parentEntity.block === entity.block) ||
                    (depth === 3 && parentEntityType === 'elem' && parentEntity.block === entity.block &&
                        parentEntity.elem === entity.elem) ||
                    (depth === 3 && parentEntityType === 'blockMod' && parentEntity.block === entity.block &&
                        parentEntity.modName === entity.modName) ||
                    (depth === 4 && parentEntity.block === entity.block && parentEntity.elem === entity.elem &&
                        parentEntity.modName === entity.modName)
                )) {
                    add({
                        entity: entity,
                        level: level,
                        tech: splited.join('.'),
                        path: filename
                    });
                }
            }
        }

        next();
    };
};
