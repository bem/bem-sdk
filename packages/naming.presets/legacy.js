'use strict';

const origin = require('./origin');

module.exports = {
    ...origin,
    fs: {
        ...origin.fs,
        pattern: '${entity}.${tech}',
    }
};
