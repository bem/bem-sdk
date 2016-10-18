'use strict';

const normalizer = {
    v1: require('./normalize/v1'),
    v2: require('./normalize/v2'),
    harmony: require('./normalize/harmony'),
    enb: require('./normalize/v2')
};

module.exports = (decl, opts) => {
    opts || (opts = {});

    const format = opts.format || 'v2';

    return normalizer[format](decl);
};
