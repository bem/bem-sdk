'use strict';

const normalize = {
    default: require('./normalize'),
    harmony: require('./normalize-harmony'),
    v2: require('./normalize2')
};

module.exports = {
    normalize: (decl, opts) => {
        opts || (opts = {});

        if (opts.v2) {
            return normalize.v2(decl);
        }

        if (opts.harmony) {
            return normalize.harmony(decl);
        }

        return normalize.default(decl);
    },
    merge: require('./merge'),
    subtract: require('./subtract'),
    intersect: require('./intersect'),
    parse: require('./parse'),
    assign: require('./assign'),
    normalizer: (version) => (normalize[version] || normalize.default)
};
