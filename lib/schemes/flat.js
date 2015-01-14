module.exports = function (level, naming) {
    return function (item, add, walk, next) {
        var splited = item.basename.split('.');

        if (splited.length > 1) {
            var entity = naming.parse(splited.shift());

            if (entity) {
                add({
                    entity: entity,
                    level: level,
                    tech: splited.join('.'),
                    path: item.filename
                });
            }
        }

        next();
    };
};
