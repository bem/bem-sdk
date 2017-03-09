'use strict';

const createNaming = require('./lib/create-naming');

const api = [
    'parse', 'stringify',
    'elemDelim', 'modDelim', 'modValDelim'
];
const originalNaming = createNaming();

api.forEach(function (name) {
    createNaming[name] = originalNaming[name];
});

module.exports = createNaming;
