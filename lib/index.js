'use strict';

const normalize = {
    v1: require('./normalize'),
    v2: require('./normalize2'),
    harmony: require('./normalize-harmony'),
    enb: require('./normalize2')
};

module.exports = {
    normalize: (decl, opts) => {
        opts || (opts = {});

        return opts.format ? normalize[opts.format](decl) : normalize.v2(decl);
    },
    merge: require('./merge'),
    subtract: require('./subtract'),
    intersect: require('./intersect'),
    parse: require('./parse'),
    assign: require('./assign'),
    load: require('./load'),
    stringify: require('./stringify'),
    normalizer: format => (normalize[format] || normalize.v2)
};
