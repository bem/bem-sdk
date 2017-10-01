'use strict';

const VertexSet = require('./vertex-set');

/**
 * Направленый граф
 *
 * @type {module.DirectedGraph}
 */
module.exports = class DirectedGraph {
    constructor() {
        this._vertices = new VertexSet();
        this._edgeMap = new Map();
    }
    addVertex(vertex) {
        this._vertices.add(vertex);

        return this;
    }
    hasVertex(vertex) {
        return this._vertices.has(vertex);
    }
    vertices() {
        return this._vertices.values();
    }
    addEdge(fromVertex, toVertex) {
        this.addVertex(fromVertex).addVertex(toVertex);

        let successors = this._edgeMap.get(fromVertex.id);

        if (!successors) {
            successors = new VertexSet();

            this._edgeMap.set(fromVertex.id, successors);
        }

        successors.add(toVertex);

        return this;
    }
    hasEdge(fromVertex, toVertex) {
        return this.directSuccessors(fromVertex).has(toVertex);
    }
    directSuccessors(vertex) {
        return this._edgeMap.get(vertex.id) || new VertexSet();
    }
    * successors(startVertex) {
        const graph = this;

        function* step(fromVertex) {
            const successors = graph.directSuccessors(fromVertex);

            for (let vertex of successors) {
                yield vertex;
                yield * step(vertex);
            }
        }

        yield * step(startVertex);
    }
}
