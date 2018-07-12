'use strict';

const origin = require('./origin');

module.exports = {
    ...origin,
    delims: {
        ...origin.delims,
        elem: '-'
    },
    fs: {
        ...origin.fs,
        delims: { elem: '' }
    },
    wordPattern: '[a-zA-Z0-9]+'
};
