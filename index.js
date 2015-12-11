var _ = require('lodash'),
    stringifyObj = require('stringify-object'),
    depsNormalize = require('deps-normalize'),
    naming = require('bem-naming');

function getEntities(bemjson, ctx) {
    var visited = [];

    function _getEntities(bemjson, ctx) {
        ctx = ctx || {};

        var deps = [],
            contentDeps;

        if (Array.isArray(bemjson)) {
            bemjson.forEach(function(item) {
                contentDeps = _getEntities(item, ctx);
                contentDeps && (deps = deps.concat(contentDeps));
            });

            return deps;
        }

        if (typeof bemjson !== 'object') return;

        bemjson.block && (ctx.block = bemjson.block);

        var depItem = {
            block: ctx.block
        };

        bemjson.elem && (depItem.elem = bemjson.elem);
        bemjson.mods && (depItem.mods = bemjson.mods);
        bemjson.elemMods && (depItem.mods = bemjson.elemMods);

        depsNormalize(depItem).forEach(function(depItem) {
            var depName = naming.stringify(depItem);
            if (visited.indexOf(depName) < 0) {
                visited.push(depName);
                deps.push(depItem);
            }
        });

        bemjson.mix && (deps = deps.concat(_getEntities(bemjson.mix, ctx)));

        bemjson.content && (deps = deps.concat(_getEntities(bemjson.content, ctx)));

        return deps.filter(Boolean);
    }

    return _getEntities(bemjson, ctx);
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
