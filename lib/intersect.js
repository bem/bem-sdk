var naming = require('bem-naming');

module.exports = function () {
    var hash = {},
        decl,
        entity, key, val,
        i, j, l, dl,
        res = [];

    for (i = 0, l = arguments.length; i < l; ++i) {
        decl = arguments[i];

        for (j = 0, dl = decl.length; j < dl; ++j) {
            entity = decl[j];
            key = naming.stringify(entity);
            val = hash[key];

            if (!val) {
                // mark entity
                hash[key] = 1;
            } else if (val === 1) {
                // add if entity has been mark
                res.push(entity);

                // to not add twice
                hash[key] = 2;
            }
        }
    }

    return res;
};
