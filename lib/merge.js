var naming = require('bem-naming');

module.exports = function () {
    var hash = {},
        firstDecl = arguments[0],
        current,
        entity, key,
        i, j, l, cl,
        res;

    // build index on first declaration
    for (i = 0, l = firstDecl.length; i < l; ++i) {
        hash[naming.stringify(firstDecl[i])] = true;
    }

    // merge first declaration with other
    res = [].concat(firstDecl);
    for (i = 1, l = arguments.length; i < l; ++i) {
        current = arguments[i];

        for (j = 0, cl = current.length; j < cl; ++j) {
            entity = current[j];
            key = naming.stringify(entity);

            if (!hash[key]) {
                res.push(entity);
                hash[key] = true;
            }
        }
    }

    return res;
};
