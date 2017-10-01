'use strict';

const BemCell = require('@bem/sdk.cell');
const bemNaming = require('@bem/sdk.naming.entity');

const BemGraph = require('./bem-graph');

function depsMacro(obj) {
    const graphFunction = obj.graph;

    if (obj.graph.length === 0) {
        const graph = graphFunction();

        obj.test(graph);
        return;
    }

    const unorderedGraph = graphFunction('linkWith');
    const orderedGraph = graphFunction('dependsOn');

    obj.test(unorderedGraph);
    obj.test(orderedGraph);
}

function createVertex(entity, tech) {
    if (typeof entity === 'string') {
        const p = entity.split('.');

        entity = bemNaming.parse(p[0]);
        tech || (tech = p[1]);
    }

    return BemCell.create({ entity, tech });
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

function createGraph(str) {
    const graph = new BemGraph();
    const keyRe = /^[\w_.]+$/;
    const operatorRe = /^[-=]>$/;

    str.split(/[\n,]/g).map(s => s.trim()).filter(Boolean).forEach(expr => {
        const err = s => { throw new Error(s || ('Invalid format of graph expression: ' + expr)); };
        expr = expr.trim();
        if (!expr) { return; }

        const exprs = expr.match(/(\s*[\w_.]+\s*|\s*[-=]>\s*)/g).map(s => s.trim()).filter(Boolean);

        if (!(exprs.length % 2) || !exprs.every((s, i) => (i % 2 ? operatorRe : keyRe).test(s))) { return err(); }

        exprs
            .reduce((res, v, i, a) =>
                (i < 2 || i % 2
                    ? res
                    : res.concat({
                        vertex: createVertex(a[i-2]),
                        dependOn: createVertex(v),
                        ordered: a[i-1] === '=>'
                    })
                ), [])
            .forEach(v => {
                const vertex = graph.vertex(v.vertex.entity, v.vertex.tech);
                v.ordered
                    ? vertex.dependsOn(v.dependOn.entity, v.dependOn.tech)
                    : vertex.linkWith(v.dependOn.entity, v.dependOn.tech);
            });
    });

    return graph;
}

/**
 * Utilities for tests
 */
module.exports = {
    findIndex,
    findLastIndex,
    depsMacro,
    createVertex,
    simplifyVertices,
    createGraph
};
