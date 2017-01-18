'use strict';

const test = require('ava');

const BemEntityName = require('@bem/entity-name');
const BemCell = require('@bem/cell');

const DirectedGraph = require('../../lib/directed-graph');

test('should return successors', t => {
    const graph = new DirectedGraph();
    const vertex1 = new BemCell({ entity: new BemEntityName({ block: 'button' }) });
    const vertex2 = new BemCell({ entity: new BemEntityName({ block: 'control' }) });

    graph.addEdge(vertex1, vertex2);

    const successors = graph.directSuccessors(vertex1);

    t.deepEqual(Array.from(successors), [vertex2]);
});

test('should return empty set if no successors', t => {
    const graph = new DirectedGraph();
    const vertex = new BemCell({ entity: new BemEntityName({ block: 'button' }) });

    const successors = graph.directSuccessors(vertex);

    t.deepEqual(Array.from(successors), []);
});
