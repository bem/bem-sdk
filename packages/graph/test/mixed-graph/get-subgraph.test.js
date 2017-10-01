'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;


const DirectedGraph = require('../../lib/directed-graph');
const MixedGraph = require('../../lib/mixed-graph');

describe('mixed-graph/get-subgraph', () => {
    it('should return unordered subgraph with common deps', () => {
        const mixedGraph = new MixedGraph();
        const directedGraph = new DirectedGraph();

        mixedGraph._unorderedGraphMap.set(undefined, directedGraph);

        const subgraph = mixedGraph._getSubgraph({ ordered: false });

        expect(subgraph).to.equal(directedGraph);    });

    it('should return ordered subgraph with common deps', () => {
        const mixedGraph = new MixedGraph();
        const directedGraph = new DirectedGraph();

        mixedGraph._orderedGraphMap.set(undefined, directedGraph);

        const subgraph = mixedGraph._getSubgraph({ ordered: true });

        expect(subgraph).to.equal(directedGraph);    });

    it('should return unordered subgraph with tech deps', () => {
        const mixedGraph = new MixedGraph();
        const directedGraph = new DirectedGraph();

        mixedGraph._unorderedGraphMap.set('css', directedGraph);

        const subgraph = mixedGraph._getSubgraph({ tech: 'css', ordered: false });

        expect(subgraph).to.equal(directedGraph);    });

    it('should return ordered subgraph with tech deps', () => {
        const mixedGraph = new MixedGraph();
        const directedGraph = new DirectedGraph();

        mixedGraph._orderedGraphMap.set('css', directedGraph);

        const subgraph = mixedGraph._getSubgraph({ tech: 'css', ordered: true });

        expect(subgraph).to.equal(directedGraph);    });
});
