import { BemCell } from '@bem/sdk.cell';

import { DirectedGraph } from './directed-graph.js';
import { VertexSet } from './vertex-set.js';
import { series } from './iter.js';

export interface EdgeData {
  ordered?: boolean;
  tech?: string | null;
}

export class MixedGraph {
  private readonly _vertices = new VertexSet<BemCell>();
  private readonly _orderedGraphMap = new Map<string | null, DirectedGraph<BemCell>>();
  private readonly _unorderedGraphMap = new Map<string | null, DirectedGraph<BemCell>>();

  addVertex(vertex: BemCell): this {
    this._vertices.add(vertex);
    return this;
  }

  hasVertex(vertex: BemCell): boolean {
    return this._vertices.has(vertex);
  }

  vertices(): MapIterator<BemCell> {
    return this._vertices.values();
  }

  addEdge(fromVertex: BemCell, toVertex: BemCell, data: EdgeData = {}): this {
    const tech = fromVertex.tech || null;
    this.addVertex(fromVertex).addVertex(toVertex);

    let subgraph = this._getSubgraph({ tech, ordered: data.ordered });
    if (!subgraph) {
      const graphMap = this._getGraphMap(data);
      subgraph = new DirectedGraph<BemCell>();
      graphMap.set(tech, subgraph);
    }
    subgraph.addEdge(fromVertex, toVertex);
    return this;
  }

  /**
   * Direct successors of a vertex.
   *
   * Walks both the no-tech (`null`) graph and the tech-specific subgraph,
   * returning the union as an ordered iterable.
   */
  directSuccessors(vertex: BemCell, data: EdgeData = {}): Iterable<BemCell> {
    const graphMap = this._getGraphMap(data);
    const commonGraph = graphMap.get(null);
    const techGraph = data.tech ? graphMap.get(data.tech) : undefined;

    const vertexWithoutTech =
      vertex.tech ? new BemCell({ entity: vertex.entity }) : undefined;
    const vertexWithDataTech =
      data.tech && !vertex.tech
        ? new BemCell({ entity: vertex.entity, tech: data.tech })
        : undefined;

    const commonGraphIterator =
      vertexWithoutTech && commonGraph
        ? commonGraph.directSuccessors(vertexWithoutTech)
        : null;
    const commonGraphIterator2 =
      commonGraph ? commonGraph.directSuccessors(vertex) : null;
    const techGraphIterator =
      vertexWithDataTech && techGraph
        ? techGraph.directSuccessors(vertexWithDataTech)
        : null;
    const techGraphIterator2 =
      techGraph ? techGraph.directSuccessors(vertex) : null;

    return series<BemCell>(
      commonGraphIterator ?? [],
      commonGraphIterator2 ?? [],
      techGraphIterator ?? [],
      techGraphIterator2 ?? [],
    );
  }

  private _getGraphMap(data: EdgeData): Map<string | null, DirectedGraph<BemCell>> {
    return data.ordered ? this._orderedGraphMap : this._unorderedGraphMap;
  }

  private _getSubgraph(data: EdgeData): DirectedGraph<BemCell> | undefined {
    return this._getGraphMap(data).get(data.tech ?? null);
  }
}

export default MixedGraph;
