'use strict';

const debug = require('debug')('bem-deps');
const decl = require('bem-decl');
const declNormalize = decl.normalizer('v2');
const BemEntityName = require('bem-entity-name');
const declAssign = function (nd, scope) {
    nd = decl.assign(nd, scope);
    nd.entity = new BemEntityName(nd.entity);
    return nd;
};

/**
 * @param {Array<{entity: BemEntityName, scope: {entity, tech: String}, data: *}>} depsData - List of deps
 * @returns {Array<*>}
 */
module.exports = function parse(depsData) {
    const mustDeps = [];
    const shouldDeps = [];
    const mustDepsIndex = {};
    const shouldDepsIndex = {};

    depsData.forEach(record => {
        const scope = record.scope || { entity: new BemEntityName(record.entity) };
        const data = [].concat(record.data);

        data.forEach(dep => {
            const subscope = declAssign({
                entity: { block: dep.block, elem: dep.elem, modName: dep.mod, modVal: dep.val },
                tech: dep.tech
            }, scope);
            const subscopeKey = declKey(subscope);

            if (dep.mustDeps) {
                declNormalize(dep.mustDeps).forEach(function (nd) {
                    nd = declAssign(nd, subscope);
                    const key = declKey(nd);
                    const indexKey = subscopeKey + '→' + key;
                    if (!mustDepsIndex[indexKey]) {
                        subscopeKey === key ||
                            mustDeps.push({ vertex: subscope, dependOn: nd, ordered: true, path: record.path });
                        mustDepsIndex[indexKey] = true;
                    }
                });
            }
            if (dep.shouldDeps) {
                declNormalize(dep.shouldDeps).forEach(function (nd) {
                    nd = declAssign(nd, subscope);
                    const key = declKey(nd);
                    const indexKey = subscopeKey + '→' + key;
                    if (!shouldDepsIndex[indexKey]) {
                        subscopeKey === key ||
                            shouldDeps.push({ vertex: subscope, dependOn: nd, path: record.path });
                        shouldDepsIndex[indexKey] = true;
                    }
                });
            }
            if (dep.noDeps) {
                declNormalize(dep.noDeps).forEach(function (nd) {
                    nd = declAssign(nd, subscope);
                    const key = declKey(nd);
                    const indexKey = subscopeKey + '→' + key;
                    removeFromDeps(key, indexKey, mustDepsIndex, mustDeps);
                    removeFromDeps(key, indexKey, shouldDepsIndex, shouldDeps);
                });
            }
        });
    });

    function declKey(nd) {
        return nd.tech ? `${nd.entity.id}.${nd.tech}` : nd.entity.id;
    }

    function removeFromDeps(key, indexKey, index, list) {
        if (index[indexKey]) {
            for (var i = 0, l = list.length; i < l; i++) {
                if (declKey(list[i].dependOn) === key) {
                    return list.splice(i, 1);
                }
            }
        } else {
            index[indexKey] = true;
        }
        return null;
    }

    debug('parsed-deps: ', mustDeps.concat(shouldDeps)
        .map(v => `${new BemEntityName(v.vertex.entity, v.vertex.tech).id} ${v.ordered ? '=>' : '->'}` +
            ` ${new BemEntityName(v.dependOn.entity, v.dependOn.tech).id} : ${v.path}`));

    return mustDeps.concat(shouldDeps);
};
