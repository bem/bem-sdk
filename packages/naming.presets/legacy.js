'use strict';

const origin = require('./origin');

module.exports = Object.assign({}, origin, {
    fs: Object.assign({}, origin.fs, {
        pattern: '${entity}${layer?@${layer}}.${tech}',
    })
});
