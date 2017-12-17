'use strict';

const normalizer = {
    v1: require('./formats/v1/normalize'),
    v2: require('./formats/v2/normalize'),
    harmony: require('./formats/harmony/normalize'),
    enb: require('./formats/enb/normalize')
};

module.exports = (decl, opts) => {
    opts || (opts = {});

    const format = opts.format || 'v2';

    return normalizer[format](decl, opts.scope);
};
