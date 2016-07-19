'use strict';

const BemEntityName = require('bem-entity-name');
const BemNaming = require('bem-naming');
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
        const _positions = entities.reduce((res, e, pos) => { res[BemNaming.stringify(e)] = pos; return res; }, {});
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
        const orderedSuccessors = new VertexSet();
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

                orderedSuccessors.add(successor);

                crumbs.push(successor);

                step(successor);

                crumbs.pop();
            }

            for (let successor of unorderedDirectSuccessors) {
                if (successor.id === fromVertex.id || unorderedSuccessors.has(successor)) {
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

        const _unorderedSuccessors = backsort ? Array.from(unorderedSuccessors).sort(backsort) : unorderedSuccessors;

        return series(reverse(orderedSuccessors), [startVertex], _unorderedSuccessors);
    }
    naturalize() {
        const mixedGraph = this._mixedGraph;

        const vertices = Array.from(mixedGraph.vertices());
        const index = {};
        for (let vertex of vertices) {
            index[vertex.id] = vertex;
        }

        for (let vertex of vertices) {
            const entity = vertex.entity;
            // Elem modifier should depend on elen by default
            if (entity.elem && entity.modName) {
                index[`${entity.block}__${entity.elem}`] &&
                    mixedGraph.addEdge(vertex, index[`${entity.block}__${entity.elem}`], {ordered: true});
            }
            // Elem should depend on block by default
            else if (entity.elem) {
                index[entity.block] && mixedGraph.addEdge(vertex, index[entity.block], {ordered: true});
            }
            // Block modifier should depend on block by default
            else if (entity.modName) {
                index[entity.block] && mixedGraph.addEdge(vertex, index[entity.block], {ordered: true});
            }
        }
    }
    _sortNaturally(entities) {
        const order = {};
        let idx = 0;
        for (let entity of entities) {
            entity.id || (entity.id = BemNaming.stringify(entity));
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

        this.graph._mixedGraph.addEdge(this.vertex, dependencyVertex, { ordered: false });

        return this;
    }
    dependsOn(entity, tech) {
        const entityName = new BemEntityName(entity);
        const dependencyVertex = new Vertex(entityName, tech);

        this.graph._mixedGraph.addEdge(this.vertex, dependencyVertex, { ordered: true });

        return this;
    }
}

module.exports = BemGraph;
