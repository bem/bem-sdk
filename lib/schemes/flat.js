module.exports = function (level, naming) {
    return function (item, add, walk, next) {
        var splited = item.basename.split('.');

        if (splited.length > 1) {
            var obj = naming.parse(splited.shift());

            if (obj) {
                obj.level = level;
                obj.tech = splited.join('.');
                obj.path = item.filename;

                add(obj);
            }
        }

        next();
    };
};
