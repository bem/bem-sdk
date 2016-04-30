'use strict';

const normalize = require('./normalize');
const normalize2 = require('./normalize-harmony');

module.exports = {
    normalize: (decl, opts) => {
        opts || (opts = {});

        return opts.harmony ? normalize2(decl) : normalize(decl);
    },
    merge: require('./merge'),
    subtract: require('./subtract'),
    intersect: require('./intersect')
};
