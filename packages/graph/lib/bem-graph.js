'use strict';

const debug = require('debug')('bem-graph');
const BemCell = require('@bem/cell');
const BemEntityName = require('@bem/entity-name');

const MixedGraph = require('./mixed-graph');
const resolve = require('./mixed-graph-resolve');

class BemGraph {
    constructor() {
        this._mixedGraph = new MixedGraph();
    }
    vertex(entity, tech) {
        const mixedGraph = this._mixedGraph;

        const vertex = new BemCell({ entity: new BemEntityName(entity), tech });

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

            res.push(new BemCell({ entity: entityName }));

            // Multiply techs
            tech && res.push(new BemCell({ entity: entityName, tech }));

            return res;
        }, []);

        const iter = resolve(this._mixedGraph, vertices, tech);
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
        const dependencyVertex = new BemCell({ entity: new BemEntityName(entity), tech });

        debug('link ' + this.vertex.id + ' -> ' + dependencyVertex.id);
        this.graph._mixedGraph.addEdge(this.vertex, dependencyVertex, { ordered: false });

        return this;
    }
    dependsOn(entity, tech) {
        const dependencyVertex = new BemCell({ entity: new BemEntityName(entity), tech });

        debug('link ' + this.vertex.id + ' => ' + dependencyVertex.id);
        this.graph._mixedGraph.addEdge(this.vertex, dependencyVertex, { ordered: true });

        return this;
    }
}

module.exports = BemGraph;
