'use strict';

const test = require('ava');

const BemEntityName = require('@bem/entity-name');
const BemCell = require('@bem/cell');

const DirectedGraph = require('../../lib/directed-graph');

const vertex1 = new BemCell({ entity: new BemEntityName({ block: 'select' }) });
const vertex2 = new BemCell({ entity: new BemEntityName({ block: 'button' }) });
const vertex3 = new BemCell({ entity: new BemEntityName({ block: 'control' }) });

test('should return empty iterator', t => {
    const graph = new DirectedGraph();

    const successors = graph.successors(vertex1);
    t.deepEqual(Array.from(successors), []);
});

test('should not iterate on itself', t => {
    const graph = new DirectedGraph();

    graph.addVertex(vertex1);

    const successors = graph.successors(vertex1);
    t.deepEqual(Array.from(successors), []);
});

test('should iterate on direct successor', t => {
    const graph = new DirectedGraph();

    graph.addEdge(vertex1, vertex2);

    const successors = graph.successors(vertex1);
    t.deepEqual(Array.from(successors), [vertex2]);
});

test('should iterate on direct successor in adding order', t => {
    const graph = new DirectedGraph();

    graph.addEdge(vertex1, vertex2);
    graph.addEdge(vertex1, vertex3);

    const successors = graph.successors(vertex1);
    t.deepEqual(Array.from(successors), [vertex2, vertex3]);
});

test('should iterate on transitive successors', t => {
    const graph = new DirectedGraph();

    graph.addEdge(vertex1, vertex2);
    graph.addEdge(vertex2, vertex3);

    const successors = graph.successors(vertex1);
    t.deepEqual(Array.from(successors), [vertex2, vertex3]);
});

test('should iterate on loop', t => {
    const graph = new DirectedGraph();

    graph.addEdge(vertex1, vertex2);
    graph.addEdge(vertex2, vertex1);

    const successors = graph.successors(vertex1);

    const step1 = successors.next();
    const step2 = successors.next();
    const step3 = successors.next();
    const step4 = successors.next();

    const values = [step1, step2, step3, step4].map(step => step.value);

    t.deepEqual(values, [vertex2, vertex1, vertex2, vertex1]);
});
