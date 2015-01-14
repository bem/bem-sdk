var path = require('path');

module.exports = function (level, naming) {
    return function (item, add, walk, next) {
        var basename = item.basename,
            filename = item.filename,
            depth = item.depth,
            splited = basename.split('.'),
            parentEntity, parentEntityType;

        if (splited.length === 1) {
            var dirname = item.dirname,
                parent;

            if (depth === 1) {
                parentEntity = naming.parse(basename);
                parentEntityType = naming.typeOf(parentEntity);

                if (parentEntityType === 'block') {
                    return walk(filename, { notation: parentEntity, type: parentEntityType });
                }
            } else if (depth === 2) {
                parent = path.basename(dirname);
                parentEntity = naming.parse(parent + basename);
                parentEntityType = naming.typeOf(parentEntity);

                if (parentEntityType === 'blockMod' || parentEntityType === 'elem') {
                    return walk(filename, { notation: parentEntity, type: parentEntityType });
                }
            } else if (depth === 3) {
                var grandParent = path.basename(path.dirname(dirname));

                parent = path.basename(dirname);
                parentEntity = naming.parse(grandParent + parent + basename);
                parentEntityType = naming.typeOf(parentEntity);

                if (parentEntityType === 'elemMod') {
                    return walk(filename, { notation: parentEntity, type: parentEntityType });
                }
            }
        } else {
            if (depth > 1) {
                var data = item.data,
                    entity = naming.parse(splited.shift());

                parentEntity = data.notation;
                parentEntityType = data.type;

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
