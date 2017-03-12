'use strict';

const stringifyObj = require('stringify-object');
const normalize = require('bem-decl').normalize;
const BemEntity = require('@bem/entity-name');

function getEntities(bemjson, ctx) {
    const visited = {};

    function _getEntities(bemjson_, ctx_) {
        ctx_ = Object.assign({}, ctx_);

        let deps = [];
        let contentDeps;

        if (Array.isArray(bemjson_)) {
            bemjson_.forEach(function(item) {
                contentDeps = _getEntities(item, ctx_);
                contentDeps && (deps = deps.concat(contentDeps));
            });

            return deps;
        }

        if (typeof bemjson_ !== 'object') {
            return;
        }

        bemjson_.block && (ctx_.block = bemjson_.block);

        const declItem = {
            block: ctx_.block
        };

        bemjson_.elem && (declItem.elem = bemjson_.elem);
        bemjson_.elem ?
            bemjson_.elemMods && (declItem.mods = bemjson_.elemMods) :
            bemjson_.mods && (declItem.mods = bemjson_.mods);

        const decl = normalize(declItem, { harmony: true });

        decl.forEach(declItem_ => {
            const entity = new BemEntity(declItem_.entity);
            _pushTo(entity, deps, visited);

            if (entity.isSimpleMod() === false) {
                _pushTo(BemEntity.create(Object.assign({}, declItem, { modVal: true })), deps, visited);
            }
        });

        ['mix', 'content'].forEach(function(k) {
            bemjson_[k] && (deps = deps.concat(_getEntities(bemjson_[k], ctx_)));
        });

        ['js', 'attrs'].forEach(function(k) {
            bemjson_[k] && Object.keys(bemjson_[k]).forEach(function(kk) {
                deps = deps.concat(_getEntities(bemjson_[k][kk], ctx_));
            });
        });

        return deps.filter(Boolean);
    }

    return _getEntities(bemjson, ctx);
}

function _pushTo(declItem, deps, visited) {
    if (!visited[declItem.id]) {
        visited[declItem.id] = true;
        deps.push(declItem);
    }
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
