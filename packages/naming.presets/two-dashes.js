'use strict';

const origin = require('./origin');

module.exports = Object.assign({}, origin, {
    delims: {
        elem: '__',
        mod: { name: '--', val: '_' }
    }
});
