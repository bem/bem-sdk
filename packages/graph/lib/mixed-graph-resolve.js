'use strict';

const series = require('ho-iter').series;

const BemCell = require('@bem/sdk.cell')
const VertexSet = require('./vertex-set');
const CircularDependencyError = require('./circular-dependency-error');

module.exports = resolve;

class TopoGroups {
    constructor() {
        this._groups = [];
        this._index = new Map();
    }
    lookup(id) {
        return this._index.get(id);
    }
    lookupCreate(id) {
        let group = this.lookup(id);
        if (!group) {
            group = new Set([id]);
            this._index.set(id, group);
            this._groups.push(group);
        }
        return group;
    }
    merge(vertexId, parentId) {
        const parentGroup = this.lookupCreate(parentId);
        const vertexGroup = this.lookup(vertexId);

        if (parentGroup !== vertexGroup) {
            for (let id of vertexGroup) {
                this._index.set(id, parentGroup);
                vertexGroup.delete(id);
                parentGroup.add(id);
            }
        }
    }
}

function resolve(mixedGraph, startVertices, tech) {
    const _positions = startVertices.reduce((res, e, pos) => { res[e.id] = pos; return res; }, {});
    const backsort = (a, b) => _positions[a.id] - _positions[b.id];

    const orderedSuccessors = []; // L ← Empty list that will contain the sorted nodes
    const _orderedVisits = {}; // Hash with visiting flags: temporary - false, permanently - true
    const unorderedSuccessors = new VertexSet(); // The rest nodes
    let crumbs = [];
    const topo = new TopoGroups();

    // ... while there are unmarked nodes do
    for (let v of startVertices) {
        visit(v, false);
    }

    const _orderedSuccessors = Array.from(new VertexSet(orderedSuccessors.reverse()));
    const _unorderedSuccessors = Array.from(unorderedSuccessors).sort(backsort);

    return series(_orderedSuccessors, _unorderedSuccessors);

    function visit(fromVertex, isWeak) {
        // ... if n has a temporary mark then stop (not a DAG)
        if (!isWeak && _orderedVisits[fromVertex.id] === false) {
            if (crumbs.filter(c => (c.entity.id === fromVertex.entity.id) &&
                (!c.tech || c.tech === fromVertex.tech)).length) {
                throw new CircularDependencyError(crumbs.concat(fromVertex)); // TODO: правильно считать цикл
            }
        }

        // ... if n is marked (i.e. has been visited yet)
        if (_orderedVisits[fromVertex.id] !== undefined) {
            // ... then already visited
            return;
        }

        crumbs.push(fromVertex);

        // ... else mark n temporarily.
        _orderedVisits[fromVertex.id] = false;

        topo.lookupCreate(fromVertex.id);

        // ... for each node m with an edge from n to m do
        const orderedDirectSuccessors = mixedGraph.directSuccessors(fromVertex, { ordered: true, tech: fromVertex.tech || tech });

        for (let successor of orderedDirectSuccessors) {
            if (!successor.tech && (tech || fromVertex.tech)) {
                successor = new BemCell({ entity: successor.entity, tech: tech || fromVertex.tech });
            }

            // TODO: Try to filter loops earlier
            if (successor.id === fromVertex.id) {
                continue;
            }

            if (isWeak) {
                // TODO: Try to speed up this slow piece of shit
                const topogroup = topo.lookup(successor.id);
                if (topogroup && !topogroup.has(fromVertex.id)) {
                    // Drop all entities for the current topogroup if came from unordered
                    for (let id of topo.lookup(successor.id)) {
                        _orderedVisits[id] = undefined;
                    }
                }
            }

            // Add to topogroup for ordered dependencies to sort them later in groups
            topo.merge(fromVertex.id, successor.id);

            visit(successor, false);
        }

        // ... mark n permanently
        // ... unmark n temporarily
        _orderedVisits[fromVertex.id] = true;

        // ... add n to head of L (L = ordered, or to tail of unordered)
        isWeak
            ? unorderedSuccessors.add(fromVertex)
            : orderedSuccessors.unshift(fromVertex);

        const unorderedDirectSuccessors = mixedGraph.directSuccessors(fromVertex, { ordered: false, tech: fromVertex.tech || tech });

        for (let successor of unorderedDirectSuccessors) {
            if (!successor.tech && (tech || fromVertex.tech)) {
                successor = new BemCell({ entity: successor.entity, tech: tech || fromVertex.tech });
            }

            // TODO: Try to filter loops earlier
            if (successor.id === fromVertex.id ||
                _orderedVisits[successor.id] ||
                unorderedSuccessors.has(successor) ||
                orderedSuccessors.indexOf(successor) !== -1) {
                continue;
            }

            let _crumbs = crumbs;
            crumbs = [];

            visit(successor, true);

            crumbs = _crumbs;
        }

        crumbs.pop();
    }
}
