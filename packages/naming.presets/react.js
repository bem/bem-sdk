'use strict';

const base = require('./origin-react');

module.exports = {
    ...base,
    fs: {
        ...base.fs,
        pattern: '${entity}${layer?@${layer}}.${tech}'
    }
};
