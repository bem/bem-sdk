'use strict';

const resolve = require('./resolve');
const isRelation = require('./is-relation');

module.exports = function (declaration, relations, options) {
    declaration || (declaration = []);
    relations || (relations = []);
    options || (options = {});

    if (!Array.isArray(relations)) {
        if (isRelation(relations)) {
            relations = [relations];
        } else if (arguments.length === 2) {
            options = relations;
            relations = [];
        }
    }

    if (typeof options === 'string') {
        options = { tech: options };
    }

    return resolve(declaration, relations, options);
};
