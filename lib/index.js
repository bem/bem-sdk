var normalize = require('./normalize'),
    normalize2 = require('./normalize-harmony');

module.exports = {
    normalize: function (decl, opts) {
        opts || (opts = {});

        return opts.harmony ? normalize2(decl) : normalize(decl);
    },
    merge: require('./merge'),
    subtract: require('./subtract'),
    intersect: require('./intersect')
};
