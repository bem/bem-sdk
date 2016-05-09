'use strict';

module.exports = function isRelationWithRequiredTech(relation, requiredTech) {
    if (!relation.tech) return true;

    return relation.tech === requiredTech;
};
