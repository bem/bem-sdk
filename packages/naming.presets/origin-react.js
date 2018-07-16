'use strict';

const origin = require('./origin');

module.exports = Object.assign({}, origin, {
    delims: Object.assign({}, origin.delims, {
        elem: '-'
    }),
    fs: Object.assign({}, origin.fs, {
        delims: { elem: '' }
    }),
    wordPattern: '[a-zA-Z0-9]+'
});
