'use strict';

const schemes = Object.create(null);
schemes.flat = require('./lib/schemes/flat');
schemes.nested = require('./lib/schemes/nested');

module.exports = function(name) {
    if (name && !schemes[name]) {
        throw new Error('Scheme not found: ' + name);
    }

    return schemes[name] || schemes.nested;
};
