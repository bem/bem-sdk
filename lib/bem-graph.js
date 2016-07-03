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

        const iter = series.apply(null, vertices.map(vertex => this._dependenciesOf(vertex, tech)));
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
    _dependenciesOf(startVertex, tech) {
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

        return series(reverse(orderedSuccessors), [startVertex], unorderedSuccessors);
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
