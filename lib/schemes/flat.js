module.exports = function (level, naming) {
    return function (item, add, walk, next) {
        var basename = item.basename,
            splited = basename.split('.'),
            bemname = splited.shift(),
            obj = naming.parse(bemname),
            tech =  splited.join('.');

        if (obj && tech) {
            obj.level = level;
            obj.tech = tech;
            obj.path = item.filename;

            add(obj);
        }

        next();
    };
};
