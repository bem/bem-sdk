import { VertexSet, type Vertex } from './vertex-set.js';

export class DirectedGraph<V extends Vertex = Vertex> {
  private readonly _vertices = new VertexSet<V>();
  private readonly _edgeMap = new Map<string, VertexSet<V>>();

  addVertex(vertex: V): this {
    this._vertices.add(vertex);
    return this;
  }

  hasVertex(vertex: V): boolean {
    return this._vertices.has(vertex);
  }

  vertices(): MapIterator<V> {
    return this._vertices.values();
  }

  addEdge(fromVertex: V, toVertex: V): this {
    this.addVertex(fromVertex).addVertex(toVertex);

    let successors = this._edgeMap.get(fromVertex.id);
    if (!successors) {
      successors = new VertexSet<V>();
      this._edgeMap.set(fromVertex.id, successors);
    }
    successors.add(toVertex);
    return this;
  }

  hasEdge(fromVertex: V, toVertex: V): boolean {
    return this.directSuccessors(fromVertex).has(toVertex);
  }

  directSuccessors(vertex: V): VertexSet<V> {
    return this._edgeMap.get(vertex.id) ?? new VertexSet<V>();
  }

  successors(startVertex: V): Generator<V, void, undefined> {
    const graph = this;
    function* step(fromVertex: V): Generator<V, void, undefined> {
      const succ = graph.directSuccessors(fromVertex);
      for (const vertex of succ) {
        yield vertex;
        yield* step(vertex);
      }
    }
    return step(startVertex);
  }
}

export default DirectedGraph;
