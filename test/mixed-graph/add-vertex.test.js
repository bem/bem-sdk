'use strict';

const test = require('ava');

const BemEntityName = require('bem-entity-name');

const Vertex = require('../../lib/vertex');
const MixedGraph = require('../../lib/mixed-graph');

const vertex = new Vertex(new BemEntityName({ block: 'button' }));

test('should be chainable', t => {
    const graph = new MixedGraph();

    t.is(graph.addVertex(vertex), graph);
});

test('should add vertex', t => {
    const graph = new MixedGraph();

    graph.addVertex(vertex);

    t.truthy(graph.hasVertex(vertex));
});

test('should add the same vertex only one', t => {
    const graph = new MixedGraph();

    graph.addVertex(vertex);
    graph.addVertex(vertex);

    const vertices = Array.from(graph.vertices());

    t.is(vertices.length, 1);
});
