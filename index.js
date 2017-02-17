const stringifyObj = require('stringify-object');
const normalize = require('bem-decl').normalize;
const BemEntity = require('@bem/entity-name');
const naming = require('bem-naming');

function getEntities(bemjson, context) {
    const visited = [];

    function _getEntities(bemjsonChunk, ctx) {
        ctx = Object.assign({}, ctx);

        let deps = [];
        let contentDeps;

        if (Array.isArray(bemjsonChunk)) {
            bemjsonChunk.forEach(function(item) {
                contentDeps = _getEntities(item, ctx);
                contentDeps && (deps = deps.concat(contentDeps));
            });

            return deps;
        }

        if (typeof bemjsonChunk !== 'object') {
            return;
        }

        bemjsonChunk.block && (ctx.block = bemjsonChunk.block);

        const declarationItem = {
            block: ctx.block
        };

        bemjsonChunk.elem && (declarationItem.elem = bemjsonChunk.elem);
        bemjsonChunk.mods && (declarationItem.mods = bemjsonChunk.mods);
        bemjsonChunk.elem && bemjsonChunk.elemMods && (declarationItem.mods = bemjsonChunk.elemMods);

        const decl = normalize(declarationItem, { harmony: true });

        decl.forEach(function(item) {
            function pushTo(declItem) {
                const depName = naming.stringify(declItem);
                if (visited.indexOf(depName) < 0) {
                    visited.push(depName);
                    deps.push(new BemEntity(declItem));
                }
            }

            pushTo(item);
            if (declarationItem.modName && declarationItem.modVal !== true) {
                pushTo(Object.assign({}, declarationItem, { modVal: true }));
            }
        });

        ['mix', 'content'].forEach(function(k) {
            bemjsonChunk[k] && (deps = deps.concat(_getEntities(bemjsonChunk[k], ctx)));
        });

        ['js', 'attrs'].forEach(function(k) {
            bemjsonChunk[k] && Object.keys(bemjsonChunk[k]).forEach(function(kk) {
                deps = deps.concat(_getEntities(bemjsonChunk[k][kk], ctx));
            });
        });

        return deps.filter(Boolean);
    }

    return _getEntities(bemjson, context);
}

function stringify(bemjson, ctx, opts) {
    opts || (opts = {});
    opts.indent || (opts.indent = '    ');

    return stringifyObj(getEntities(bemjson, ctx), opts);
}

module.exports = {
    convert: getEntities,
    stringify: stringify
};
