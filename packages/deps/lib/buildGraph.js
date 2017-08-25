'use strict';

const BemGraph = require('@bem/sdk.graph').BemGraph;

/**
 * A BEM-entity with or without a tech
 * @typedef {entity: BemEntityName, tech: ?String} Vertex
 */

/**
 * @param {Array<{vertex: Vertex, dependOn: Vertex, ordered: Boolean}>} deps - List of deps
 * @param {?{denaturalized: Boolean}} options
 * @returns {BemGraph}
 */
module.exports = function buildGraph(deps, options) {
    options || (options = {});

    const graph = new BemGraph();

    Array.isArray(deps) || (deps = [deps]);

    deps.forEach(dep => {
        const vertex = graph.vertex(dep.vertex.entity, dep.vertex.tech);

        dep.ordered ?
            vertex.dependsOn(dep.dependOn.entity, dep.dependOn.tech) :
            vertex.linkWith(dep.dependOn.entity, dep.dependOn.tech);
    });

    options.denaturalized || graph.naturalize();

    return graph;
};
