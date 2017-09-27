'use strict';

module.exports = {
    delims: {
        elem: '-',
        mod: { name: '_', val: '_' }
    },
    fs: {
        delims: { elem: '' },
        pattern: '${layer?${layer}.}blocks/${entity}.${tech}',
        scheme: 'nested'
    },
    wordPattern: '[a-zA-Z0-9]+'
};
