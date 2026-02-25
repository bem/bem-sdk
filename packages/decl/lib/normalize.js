import v1Normalize from './formats/v1/normalize.js';
import v2Normalize from './formats/v2/normalize.js';
import harmonyNormalize from './formats/harmony/normalize.js';
import enbNormalize from './formats/enb/normalize.js';

const normalizer = {
    v1: v1Normalize,
    v2: v2Normalize,
    harmony: harmonyNormalize,
    enb: enbNormalize
};

export default (decl, opts) => {
    opts || (opts = {});

    const format = opts.format || 'v2';

    return normalizer[format](decl, opts.scope);
};
