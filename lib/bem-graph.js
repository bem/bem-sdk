'use strict';

const debug = require('debug')('bem-graph');
const BemEntityName = require('bem-entity-name');
const hoi = require('ho-iter');
const series = hoi.series;
const reverse = hoi.reverse;

const Vertex = require('./vertex');
const VertexSet = require('./vertex-set');
const MixedGraph = require('./mixed-graph');
const CircularDependencyError = require('./circular-dependency-error');

class BemGraph {
    constructor() {
        this._mixedGraph = new MixedGraph();
    }
    vertex(entity, tech) {
        const mixedGraph = this._mixedGraph;

        const entityName = new BemEntityName(entity);
        const vertex = new Vertex(entityName, tech);

        mixedGraph.addVertex(vertex);

        return new BemGraph.Vertex(this, vertex);
    }
    naturalDependenciesOf(entities, tech) {
        return this.dependenciesOf(this._sortNaturally(entities), tech);
    }
    dependenciesOf(entities, tech) {
        if (!Array.isArray(entities)) {
            entities = [entities];
        }

        const vertices = entities.reduce((res, entity) => {
            const entityName = new BemEntityName(entity);

            res.push(new Vertex(entityName));

            tech && res.push(new Vertex(entityName, tech));

            return res;
        }, []);

        // Recommended order
        const _positions = vertices.reduce((res, e, pos) => { res[e.id] = pos; return res; }, {});
        const _sort = (a, b) => _positions[a.id] - _positions[b.id];

        const iter = series.apply(null, vertices.map(vertex => this._dependenciesOf(vertex, tech, _sort)));
        const arr = Array.from(iter);

        // TODO: returns iterator
        const verticesCheckList = {};
        return arr.map(vertex => {
            if (verticesCheckList[`${vertex.entity.id}.${(vertex.tech || tech)}`]) {
                return false;
            }

            const obj = { entity: vertex.entity.valueOf() };

            (vertex.tech || tech) && (obj.tech = vertex.tech || tech);
            verticesCheckList[`${vertex.entity.id}.${obj.tech}`] = true;

            return obj;
        }).filter(Boolean);
    }
    _dependenciesOf(startVertex, tech, backsort) {
        const mixedGraph = this._mixedGraph;
        const orderedSuccessors = [];
        const unorderedSuccessors = new VertexSet();
        let crumbs = [startVertex];

        function step(fromVertex) {
            const orderedDirectSuccessors = mixedGraph.directSuccessors(fromVertex, { ordered: true, tech });
            const unorderedDirectSuccessors = mixedGraph.directSuccessors(fromVertex, { ordered: false, tech });

            for (let successor of reverse(orderedDirectSuccessors)) {
                if (successor.id === fromVertex.id) {
                    continue;
                }

                if (crumbs.indexOf(successor) !== -1) {
                    // TODO: check loop specs later please.
                    throw new CircularDependencyError(crumbs); // TODO: правильно считать цикл
                }

                orderedSuccessors.push(successor);
                crumbs.push(successor);

                step(successor);

                crumbs.pop();
            }

            for (let successor of unorderedDirectSuccessors) {
                if (successor.id === fromVertex.id ||
                    unorderedSuccessors.has(successor) ||
                    orderedSuccessors.indexOf(successor) !== -1) {
                    continue;
                }

                unorderedSuccessors.add(successor);

                const _crumbs = crumbs;
                crumbs = [successor];

                step(successor);

                crumbs = _crumbs;
            }
        }

        step(startVertex);

        const _orderedSuccessors = new VertexSet(orderedSuccessors.reverse());
        const _unorderedSuccessors = backsort ? Array.from(unorderedSuccessors).sort(backsort) : unorderedSuccessors;

        return series(_orderedSuccessors, [startVertex], _unorderedSuccessors);
    }
    naturalize() {
        const mixedGraph = this._mixedGraph;

        const vertices = Array.from(mixedGraph.vertices());
        const index = {};
        for (let vertex of vertices) {
            index[vertex.id] = vertex;
        }

        function hasOrderedDepend(vertex, depend) {
            const orderedDirectSuccessors = mixedGraph.directSuccessors(vertex, { ordered: true });

            for (let successor of orderedDirectSuccessors) {
                if (successor.id === depend.id) {
                    return true;
                }
            }

            return false;
        }

        function addEdgeLosely(vertex, key) {
            const dependant = index[key];

            if (dependant) {
                if (hasOrderedDepend(dependant, vertex)) {
                    return false;
                }

                mixedGraph.addEdge(vertex, dependant, {ordered: true});
                return true;
            }

            return false;
        }

        for (let vertex of vertices) {
            const entity = vertex.entity;

            // Elem modifier should depend on elen by default
            if (entity.elem && (entity.mod && entity.mod.name || entity.modName)) {
                (entity.mod.val !== true) &&
                    addEdgeLosely(vertex, `${entity.block}__${entity.elem}_${entity.mod.name || entity.modName}`);

                addEdgeLosely(vertex, `${entity.block}__${entity.elem}`) ||
                    addEdgeLosely(vertex, entity.block);
            }
            // Elem should depend on block by default
            else if (entity.elem) {
                addEdgeLosely(vertex, entity.block);
            }
            // Block modifier should depend on block by default
            else if (entity.mod && entity.mod.name || entity.modName) {
                (entity.mod.val !== true) &&
                    addEdgeLosely(vertex, `${entity.block}_${entity.mod.name || entity.modName}`);

                addEdgeLosely(vertex, entity.block);
            }
        }
    }
    _sortNaturally(entities) {
        const order = {};
        let idx = 0;
        for (let entity of entities) {
            entity.id || (entity.id = (new BemEntityName(entity)).id);
            order[entity.id] = idx++;
        }

        let k = 1;
        for (let entity of entities) {
            // Elem should depend on block by default
            if (entity.elem && !entity.modName) {
                order[entity.block] && (order[entity.id] = order[entity.block] + 0.001*(k++));
            }
        }

        // Block/Elem boolean modifier should depend on elem/block by default
        for (let entity of entities) {
            if (entity.modName && entity.modVal === true) {
                let depId = `${entity.block}__${entity.elem}`;
                order[depId] || (depId = entity.block);
                order[depId] && (order[entity.id] = order[depId] + 0.00001*(k++));
            }
        }

        // Block/Elem key-value modifier should depend on boolean modifier, elem or block by default
        for (let entity of entities) {
            if (entity.modName && entity.modVal !== true) {
                let depId = entity.elem
                    ? `${entity.block}__${entity.elem}_${entity.modName}`
                    : `${entity.block}_${entity.modName}`;
                order[depId] || entity.elem && (depId = `${entity.block}__${entity.elem}`);
                order[depId] || (depId = entity.block);
                order[depId] && (order[entity.id] = order[depId] + 0.0000001*(k++));
            }
        }

        return entities.sort((a, b) => order[a.id] - order[b.id]);
    }
}

BemGraph.Vertex = class {
    constructor(graph, vertex) {
        this.graph = graph;
        this.vertex = vertex;
    }
    linkWith(entity, tech) {
        const entityName = new BemEntityName(entity);
        const dependencyVertex = new Vertex(entityName, tech);

        debug('link ' + this.vertex.id + ' -> ' + dependencyVertex.id);
        this.graph._mixedGraph.addEdge(this.vertex, dependencyVertex, { ordered: false });

        return this;
    }
    dependsOn(entity, tech) {
        const entityName = new BemEntityName(entity);
        const dependencyVertex = new Vertex(entityName, tech);

        debug('link ' + this.vertex.id + ' => ' + dependencyVertex.id);
        this.graph._mixedGraph.addEdge(this.vertex, dependencyVertex, { ordered: true });

        return this;
    }
}

module.exports = BemGraph;
