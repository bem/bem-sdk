'use strict';

const hashSet = require('hash-set');

module.exports = hashSet(vertex => vertex.id);
