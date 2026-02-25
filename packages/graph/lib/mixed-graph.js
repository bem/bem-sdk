import BemCell from '@bem/sdk.cell';

import VertexSet from './vertex-set.js';
import DirectedGraph from './directed-graph.js';

function* series(...iters) {
    for (const it of iters) if (it) yield* it;
}

/**
 * Mixed graph.
 *
 * Incapsulate func-ty for strict and non-strict ordering graphs.
 *
 * @type {MixedGraph}
 */
export default class MixedGraph {
    constructor() {
        this._vertices = new VertexSet();
        this._orderedGraphMap = new Map();
        this._unorderedGraphMap = new Map();
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
    addEdge(fromVertex, toVertex, data) {
        data || (data = {});

        const tech = fromVertex.tech || null;

        this.addVertex(fromVertex)
            .addVertex(toVertex);

        let subgraph = this._getSubgraph({ tech, ordered: data.ordered });

        // Create DirectedGraph for each tech
        if (!subgraph) {
            const graphMap = this._getGraphMap(data);

            subgraph = new DirectedGraph();

            graphMap.set(tech, subgraph);
        }

        subgraph.addEdge(fromVertex, toVertex);

        return this;
    }
    /**
     * Get direct successors
     *
     * @param {Vertex} vertex - Vertex with succeeding vertices
     * @param {{ordered: ?Boolean, tech: ?String}} data - ?
     * @returns {Iterator} - Iterator with succeeding vertices
     */
    directSuccessors(vertex, data) {
        data || (data = {});

        const graphMap = this._getGraphMap(data);

        const commonGraph = graphMap.get(null);
        const techGraph = data.tech && graphMap.get(data.tech);

        const vertexWithoutTech = vertex.tech && (new BemCell({ entity: vertex.entity }));
        const vertexWithDataTech = data.tech && !vertex.tech && (new BemCell({ entity: vertex.entity, tech: data.tech }));

        // TODO: think about this shit and order between virtual vertixes
        const commonGraphIterator = vertexWithoutTech && commonGraph && commonGraph.directSuccessors(vertexWithoutTech);
        const commonGraphIterator2 = commonGraph && commonGraph.directSuccessors(vertex);

        const techGraphIterator = vertexWithDataTech && techGraph && techGraph.directSuccessors(vertexWithDataTech);
        const techGraphIterator2 = techGraph && techGraph.directSuccessors(vertex);

        return series(
            commonGraphIterator || [],
            commonGraphIterator2 || [],
            techGraphIterator || [],
            techGraphIterator2 || []
        );
    }
    _getGraphMap(data) {
        return data.ordered ? this._orderedGraphMap : this._unorderedGraphMap;
    }
    _getSubgraph(data) {
        return this._getGraphMap(data).get(data.tech);
    }
}
