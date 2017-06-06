'use strict';

const test = require('ava');

const DirectedGraph = require('../../lib/directed-graph');
const MixedGraph = require('../../lib/mixed-graph');

test('should return unordered subgraph with common deps', t => {
    const mixedGraph = new MixedGraph();
    const directedGraph = new DirectedGraph();

    mixedGraph._unorderedGraphMap.set(undefined, directedGraph);

    const subgraph = mixedGraph._getSubgraph({ ordered: false });

    t.is(subgraph, directedGraph);
});

test('should return ordered subgraph with common deps', t => {
    const mixedGraph = new MixedGraph();
    const directedGraph = new DirectedGraph();

    mixedGraph._orderedGraphMap.set(undefined, directedGraph);

    const subgraph = mixedGraph._getSubgraph({ ordered: true });

    t.is(subgraph, directedGraph);
});

test('should return unordered subgraph with tech deps', t => {
    const mixedGraph = new MixedGraph();
    const directedGraph = new DirectedGraph();

    mixedGraph._unorderedGraphMap.set('css', directedGraph);

    const subgraph = mixedGraph._getSubgraph({ tech: 'css', ordered: false });

    t.is(subgraph, directedGraph);
});

test('should return ordered subgraph with tech deps', t => {
    const mixedGraph = new MixedGraph();
    const directedGraph = new DirectedGraph();

    mixedGraph._orderedGraphMap.set('css', directedGraph);

    const subgraph = mixedGraph._getSubgraph({ tech: 'css', ordered: true });

    t.is(subgraph, directedGraph);
});
