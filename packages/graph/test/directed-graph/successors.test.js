'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;


const BemEntityName = require('@bem/sdk.entity-name');
const BemCell = require('@bem/sdk.cell');

const DirectedGraph = require('../../lib/directed-graph');

const vertex1 = new BemCell({ entity: new BemEntityName({ block: 'select' }) });
const vertex2 = new BemCell({ entity: new BemEntityName({ block: 'button' }) });
const vertex3 = new BemCell({ entity: new BemEntityName({ block: 'control' }) });

describe('directed-graph/successors', () => {
    it('should return empty iterator', () => {
        const graph = new DirectedGraph();

        const successors = graph.successors(vertex1);
        expect(Array.from(successors)).to.deep.equal([]);
    });

    it('should not iterate on itself', () => {
        const graph = new DirectedGraph();

        graph.addVertex(vertex1);

        const successors = graph.successors(vertex1);
        expect(Array.from(successors)).to.deep.equal([]);
    });

    it('should iterate on direct successor', () => {
        const graph = new DirectedGraph();

        graph.addEdge(vertex1, vertex2);

        const successors = graph.successors(vertex1);
        expect(Array.from(successors)).to.deep.equal([vertex2]);
    });

    it('should iterate on direct successor in adding order', () => {
        const graph = new DirectedGraph();

        graph.addEdge(vertex1, vertex2);
        graph.addEdge(vertex1, vertex3);

        const successors = graph.successors(vertex1);
        expect(Array.from(successors)).to.deep.equal([vertex2, vertex3]);
    });

    it('should iterate on transitive successors', () => {
        const graph = new DirectedGraph();

        graph.addEdge(vertex1, vertex2);
        graph.addEdge(vertex2, vertex3);

        const successors = graph.successors(vertex1);
        expect(Array.from(successors)).to.deep.equal([vertex2, vertex3]);
    });

    it('should iterate on loop', () => {
        const graph = new DirectedGraph();

        graph.addEdge(vertex1, vertex2);
        graph.addEdge(vertex2, vertex1);

        const successors = graph.successors(vertex1);

        const step1 = successors.next();
        const step2 = successors.next();
        const step3 = successors.next();
        const step4 = successors.next();

        const values = [step1, step2, step3, step4].map(step => step.value);

        expect(values).to.deep.equal([vertex2, vertex1, vertex2, vertex1]);
    });
});
