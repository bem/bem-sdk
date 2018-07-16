'use strict';

const base = require('./origin-react');

module.exports = Object.assign({}, base, {
    fs: Object.assign(base.fs, {
        pattern: '${entity}${layer?@${layer}}.${tech}'
    })
});
