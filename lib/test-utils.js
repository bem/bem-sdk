'use strict';

const BemEntityName = require('bem-entity-name');
const Vertex = require('./vertex');

function depsMacro(t, obj) {
    const graphFunction = obj.graph;

    if (obj.graph.length === 0) {
        const graph = graphFunction();

        obj.test(t, graph);
        return;
    }

    const unorderedGraph = graphFunction('linkWith');
    const orderedGraph = graphFunction('dependsOn');

    obj.test(t, unorderedGraph);
    obj.test(t, orderedGraph);
}

function createVertex(entity, tech) {
    const entityName = new BemEntityName(entity);

    return new Vertex(entityName, tech);
}

function findIndex(objs, obj) {
    if (typeof obj !== 'object') { return -1; }

    const vertex = createVertex(obj.entity, obj.tech);
    const vertices = objs.map(o => createVertex(o.entity, o.tech).id);

    return vertices.indexOf(vertex.id);
}

function findLastIndex(objs, obj) {
    if (typeof obj !== 'object') { return -1; }

    const vertex = createVertex(obj.entity, obj.tech);
    const vertices = objs.map(o => createVertex(o.entity, o.tech).id);

    return vertices.lastIndexOf(vertex.id);
}

function simplifyVertices(items) {
    return items.map(item => {
        const res = {};
        item.entity && (res.entity = item.entity.valueOf());
        item.tech && (res.tech = item.tech);
        return res;
    })
}

module.exports = { findIndex, findLastIndex, depsMacro, createVertex, simplifyVertices };
