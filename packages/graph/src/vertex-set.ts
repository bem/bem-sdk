/**
 * Ordered set of vertices keyed by `vertex.id`.
 *
 * Replaces `hash-set` — backed by a `Map<id, vertex>` to preserve identity-by-id
 * semantics while keeping insertion order.
 */
export interface Vertex {
  id: string;
}

export class VertexSet<V extends Vertex = Vertex> {
  private readonly _map = new Map<string, V>();

  add(vertex: V): this {
    this._map.set(vertex.id, vertex);
    return this;
  }

  has(vertex: V): boolean {
    return this._map.has(vertex.id);
  }

  delete(vertex: V): boolean {
    return this._map.delete(vertex.id);
  }

  get size(): number {
    return this._map.size;
  }

  values(): MapIterator<V> {
    return this._map.values();
  }

  [Symbol.iterator](): MapIterator<V> {
    return this._map.values();
  }
}

export default VertexSet;
