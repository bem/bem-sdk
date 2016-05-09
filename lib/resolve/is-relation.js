'use strict';

module.exports = function isRelation(obj) {
    return Boolean(typeof obj === 'object' && !Array.isArray(obj) && obj.entity && obj.dependOn);
};
