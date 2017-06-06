'use strict';

const createNaming = require('./lib/create-naming');

const originalNaming = createNaming();

Object.keys(originalNaming).forEach(key => {
    createNaming[key] = originalNaming[key];
});

module.exports = createNaming;
