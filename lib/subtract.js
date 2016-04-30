'use strict';

const naming = require('bem-naming');

module.exports = function (fromDecl, whatDecl) {
    const hash = {};

    // build index on what declaration
    for (let i = 0, l = whatDecl.length; i < l; ++i) {
        hash[naming.stringify(whatDecl[i])] = true;
    }

    return fromDecl.filter(function (item) {
        return !hash[naming.stringify(item)];
    });
};
