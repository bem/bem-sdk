'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;


const BemEntityName = require('@bem/sdk.entity-name');
const BemCell = require('@bem/sdk.cell');

const DirectedGraph = require('../../lib/directed-graph');

const vertex1 = new BemCell({ entity: new BemEntityName({ block: 'button' }) });
const vertex2 = new BemCell({ entity: new BemEntityName({ block: 'control' }) });

describe('directed-graph/add-edge', () => {
    it('should be chainable', () => {
        const graph = new DirectedGraph();

        expect(graph.addEdge(vertex1, vertex2)).to.equal(graph);    });

    it('should add edge', () => {
        const graph = new DirectedGraph();

        expect(graph.hasEdge(vertex1, vertex2)).to.be.not.ok;

        graph.addEdge(vertex1, vertex2);

        expect(graph.hasEdge(vertex1, vertex2)).to.be.ok;
    });

    it('should add edge to itself', () => {
        const graph = new DirectedGraph();
        const vertex = new BemCell({ entity: new BemEntityName({ block: 'button' }) });

        expect(graph.hasEdge(vertex, vertex)).to.be.not.ok;

        graph.addEdge(vertex, vertex);

        expect(graph.hasEdge(vertex, vertex)).to.be.ok;
    });

    it('should add loop', () => {
        const graph = new DirectedGraph();

        expect(graph.hasEdge(vertex1, vertex2)).to.be.not.ok;
        expect(graph.hasEdge(vertex2, vertex1)).to.be.not.ok;

        graph.addEdge(vertex1, vertex2);
        graph.addEdge(vertex2, vertex1);

        expect(graph.hasEdge(vertex1, vertex2)).to.be.ok;
        expect(graph.hasEdge(vertex2, vertex1)).to.be.ok;
    });

    it('should add vertices', () => {
        const graph = new DirectedGraph();

        expect(graph.hasEdge(vertex1, vertex2)).to.be.not.ok;

        graph.addEdge(vertex1, vertex2);

        expect(graph.hasEdge(vertex1, vertex2)).to.be.ok;
    });
});
