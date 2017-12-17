'use strict';

const isNotSupported = () => {
    throw new Error(
        'This format isn\'t supported yet, file an issue: https://github.com/bem/bem-sdk/issues/new?labels=pkg:decl'
    );
};

const baseFormat = {
    format: isNotSupported,
    parse: isNotSupported
};

const formats = {
    v1: require('./v1'),
    v2: require('./v2'),
    enb: require('./enb'),
    harmony: require('./harmony')
};

module.exports = Object.keys(formats).reduce((obj, formatName) => {
    obj[formatName] = Object.assign({}, baseFormat, formats[formatName]);

    return obj;
}, {});
