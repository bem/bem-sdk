class VertexSet {
    constructor(iterable) {
        this._map = new Map();
        if (iterable) {
            for (const vertex of iterable) {
                this.add(vertex);
            }
        }
    }
    add(vertex) {
        this._map.set(vertex.id, vertex);
        return this;
    }
    has(vertex) {
        return this._map.has(vertex.id);
    }
    get size() {
        return this._map.size;
    }
    values() {
        return this._map.values();
    }
    [Symbol.iterator]() {
        return this._map.values();
    }
    forEach(fn) {
        this._map.forEach(fn);
    }
}

export default VertexSet;
