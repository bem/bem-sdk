import v1 from './v1/index.js';
import v2 from './v2/index.js';
import enb from './enb/index.js';
import harmony from './harmony/index.js';

const isNotSupported = () => {
    throw new Error(
        'This format isn\'t supported yet, file an issue: https://github.com/bem/bem-sdk/issues/new?labels=pkg:decl'
    );
};

const baseFormat = {
    format: isNotSupported,
    parse: isNotSupported
};

const formats = { v1, v2, enb, harmony };

export default Object.keys(formats).reduce((obj, formatName) => {
    obj[formatName] = Object.assign({}, baseFormat, formats[formatName]);

    return obj;
}, {});
