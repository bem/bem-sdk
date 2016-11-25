'use strict';

const naming = require('bem-naming');

module.exports = function () {
    const hash = {};
    const res = [];

    let decl;
    let item, entity, key, val;
    let i, j, l, dl;

    for (i = 0, l = arguments.length; i < l; ++i) {
        decl = arguments[i];

        for (j = 0, dl = decl.length; j < dl; ++j) {
            item = decl[j];
            entity = item.entity;
            key = naming.stringify(entity) + item.tech;
            val = hash[key];

            if (!val) {
                // mark entity
                hash[key] = 1;
            } else if (val === 1) {
                // add if entity has been mark
                res.push(item);

                // to not add twice
                hash[key] = 2;
            }
        }
    }

    return res;
};
