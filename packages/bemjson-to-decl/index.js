'use strict';

const stringifyObj = require('stringify-object');
const normalize = require('@bem/sdk.decl').normalize;
const BemEntity = require('@bem/sdk.entity-name');

function getEntities(bemjson, ctx) {
    const visited = {};
    const collectDeps = (ent, deps, ctx_) => deps.concat(_getEntities(ent, ctx_));

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

        if (!bemjson_ || typeof bemjson_ !== 'object') {
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

        ['js', 'attrs'].forEach(k => {
            bemjson_[k] && Object.keys(bemjson_[k]).forEach(function(kk) {
                deps = collectDeps(bemjson_[k][kk], deps, ctx_);
            });
        });

        Object.keys(bemjson_).forEach(key => {
            if (~['js', 'attrs', 'mods', 'elemMods', 'block', 'elem'].indexOf(key)) { return; }

            [].concat(bemjson_[key]).forEach(ent => {
                deps = collectDeps(ent, deps, ctx_);
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

    return stringifyObj(getEntities(bemjson, ctx).map(entity => entity.toJSON()), opts);
}

module.exports = {
    convert: getEntities,
    stringify: stringify
};
