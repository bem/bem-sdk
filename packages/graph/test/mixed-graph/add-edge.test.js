'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;
const beforeEach = require('mocha').beforeEach;
const afterEach = require('mocha').afterEach;

const expect = require('chai').expect;

const sinon = require('sinon');

const BemEntityName = require('@bem/sdk.entity-name');
const BemCell = require('@bem/sdk.cell');

const MixedGraph = require('../../lib/mixed-graph');
const DirectedGraph = require('../../lib/directed-graph');

const vertex1 = new BemCell({ entity: new BemEntityName({ block: 'button' }), tech: 'css' });
const vertex2 = new BemCell({ entity: new BemEntityName({ block: 'control' }), tech: 'css' });

describe('mixed-graph/add-edge', () => {

    let context = {};

    beforeEach(() => {
        const mixedGraph = new MixedGraph();
        const getSubgraphStub = sinon.stub(mixedGraph, '_getSubgraph');
        const addVertexSpy = sinon.spy(mixedGraph, 'addVertex');

        context.mixedGraph = mixedGraph;
        context.getSubgraphStub = getSubgraphStub;
        context.addVertexSpy = addVertexSpy;
    });

    afterEach(() => {
        context.getSubgraphStub.restore();
    });

    it('should be chainable', () => {
        const graph = context.mixedGraph;

        expect(graph.addEdge(vertex1, vertex2)).to.equal(graph);    });

    it('should add vertices', () => {
        context.mixedGraph.addEdge(vertex1, vertex2);

        expect(context.addVertexSpy.calledWith(vertex1)).to.be.true;
        expect(context.addVertexSpy.calledWith(vertex2)).to.be.true;
    });

    it('should add edge to subgraph', () => {
        const directedGraph = new DirectedGraph();
        const addEdgeSpy = sinon.spy(directedGraph, 'addEdge');

        context.getSubgraphStub.returns(directedGraph);

        context.mixedGraph.addEdge(vertex1, vertex2);

        expect(addEdgeSpy.calledWith(vertex1, vertex2)).to.be.true;
    });

    it('should add subgraph to unordered map', () => {
        context.getSubgraphStub.returns(undefined);

        const mixedGraph = context.mixedGraph;

        mixedGraph.addEdge(vertex1, vertex2, { ordered: false });

        const subgraph = mixedGraph._unorderedGraphMap.get('css');

        expect(subgraph instanceof DirectedGraph).to.be.true;
    });

    it('should add subgraph to ordered map', () => {
        context.getSubgraphStub.returns(undefined);

        const mixedGraph = context.mixedGraph;

        mixedGraph.addEdge(vertex1, vertex2, { ordered: true });

        const subgraph = mixedGraph._orderedGraphMap.get('css');

        expect(subgraph instanceof DirectedGraph).to.be.true;
    });

    it('should add edge to created subgraph', () => {
        context.getSubgraphStub.returns(undefined);

        const mixedGraph = context.mixedGraph;

        mixedGraph.addEdge(vertex1, vertex2, { ordered: false, tech: 'css' });

        const subgraph = mixedGraph._unorderedGraphMap.get('css');

        expect(subgraph.hasVertex(vertex1)).to.be.true;
        expect(subgraph.hasVertex(vertex2)).to.be.true;
    });
});
