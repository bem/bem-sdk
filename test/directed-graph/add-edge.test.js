'use strict';

const test = require('ava');

const BemEntityName = require('@bem/entity-name');
const BemCell = require('@bem/cell');

const DirectedGraph = require('../../lib/directed-graph');

const vertex1 = new BemCell({ entity: new BemEntityName({ block: 'button' }) });
const vertex2 = new BemCell({ entity: new BemEntityName({ block: 'control' }) });

test('should be chainable', t => {
    const graph = new DirectedGraph();

    t.is(graph.addEdge(vertex1, vertex2), graph);
});

test('should add edge', t => {
    const graph = new DirectedGraph();

    t.falsy(graph.hasEdge(vertex1, vertex2));

    graph.addEdge(vertex1, vertex2);

    t.truthy(graph.hasEdge(vertex1, vertex2));
});

test('should add edge to itself', t => {
    const graph = new DirectedGraph();
    const vertex = new BemCell({ entity: new BemEntityName({ block: 'button' }) });

    t.falsy(graph.hasEdge(vertex, vertex));

    graph.addEdge(vertex, vertex);

    t.truthy(graph.hasEdge(vertex, vertex));
});

test('should add loop', t => {
    const graph = new DirectedGraph();

    t.falsy(graph.hasEdge(vertex1, vertex2));
    t.falsy(graph.hasEdge(vertex2, vertex1));

    graph.addEdge(vertex1, vertex2);
    graph.addEdge(vertex2, vertex1);

    t.truthy(graph.hasEdge(vertex1, vertex2));
    t.truthy(graph.hasEdge(vertex2, vertex1));
});

test('should add vertices', t => {
    const graph = new DirectedGraph();

    t.falsy(graph.hasEdge(vertex1, vertex2));

    graph.addEdge(vertex1, vertex2);

    t.truthy(graph.hasEdge(vertex1, vertex2));
});
