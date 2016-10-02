'use strict';

/**
 * Convert normalized declaration to enb format
 *
 * @param  {Array|Object} decl Source declaration
 * @return {Array}
 */
module.exports = function (decl) {
    Array.isArray(decl) || (decl = [decl]);

    return decl.map(item => {
        const entity = item.entity;
        let tmp = {};

        tmp.block = entity.block;
        entity.elem && (tmp.elem = entity.elem);
        entity.modName && (tmp.mod = entity.modName);
        entity.modVal && (tmp.val = entity.modVal);

        return tmp;
    });
};
