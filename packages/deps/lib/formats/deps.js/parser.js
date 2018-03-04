'use strict';

const debug = require('debug')('@bem/sdk.deps');
const decl = require('@bem/sdk.decl');

/**
 * @typedef {Object} DepsData
 * @property {BemCell} [scope] - Scope cell object
 * @property {BemEntityName} [entity] - Entity to use if no scope passed
 * @property {Array<DepsChunk>} data - Deps data
 */

/**
 * @typedef {(string|Object)} DepsChunk
 * @property {string} [block]
 * @property {(DepsChunk|Array<DepsChunk>)} [elem]
 * @property {string} [mod]
 * @property {string} [val]
 * @property {string} [tech]
 * @property {(DepsChunk|Array<DepsChunk>)} [elems]
 * @property {Object} [mods]
 * @property {(DepsChunk|Array<DepsChunk>)} [mustDeps]
 * @property {(DepsChunk|Array<DepsChunk>)} [shouldDeps]
 */

/**
 * @typedef {Object} DepsLink
 * @property {BemCell} vertex
 * @property {BemCell} dependOn
 * @property {boolean} [ordered] - `mustDeps` if set to true
 * @property {string} [path] - path to deps.js file if exists
 */

/**
 * @param {(Array<DepsData>|DepsData)} depsData - List of deps
 * @returns {Array<DepsLink>}
 */
module.exports = function parse(depsData) {
    const mustDeps = [];
    const shouldDeps = [];
    const mustDepsIndex = {};
    const shouldDepsIndex = {};

    [].concat(depsData).forEach(record => {
        const scope = record.scope || { entity: record.entity };

        if (!record.data) {
            return;
        }
        const data = [].concat(record.data);

        data.forEach(dep => {
            const subscope = decl.assign({
                entity: { block: dep.block, elem: dep.elem, mod: dep.mod && { name: dep.mod, val: dep.val } },
                tech: dep.tech
            }, scope);
            const subscopeKey = subscope.id;

            if (dep.mustDeps) {
                decl.normalize(dep.mustDeps, {format: 'v2', scope: subscope}).forEach(function (nd) {
                    nd = decl.assign(nd, subscope);
                    const key = nd.id;
                    const indexKey = subscopeKey + '→' + key;
                    if (!mustDepsIndex[indexKey]) {
                        subscopeKey === key ||
                            mustDeps.push({ vertex: subscope, dependOn: nd, ordered: true, path: record.path });
                        mustDepsIndex[indexKey] = true;
                    }
                });
            }
            if (dep.shouldDeps) {
                decl.normalize(dep.shouldDeps, {format: 'v2', scope: subscope}).forEach(function (nd) {
                    const key = nd.id;
                    const indexKey = subscopeKey + '→' + key;
                    if (!shouldDepsIndex[indexKey]) {
                        subscopeKey === key ||
                            shouldDeps.push({ vertex: subscope, dependOn: nd, path: record.path });
                        shouldDepsIndex[indexKey] = true;
                    }
                });
            }
            if (dep.noDeps) {
                decl.normalize(dep.noDeps, {format: 'v2', scope: subscope}).forEach(function (nd) {
                    const key = nd.id;
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

    debug.enabled && debug('parsed-deps: ', mustDeps.concat(shouldDeps)
        .map(v => `${v.vertex.id} ${v.ordered ? '=>' : '->'} ${v.dependOn.id} : ${v.path}`));

    return mustDeps.concat(shouldDeps);
};
