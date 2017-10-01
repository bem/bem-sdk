'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;


const BemEntityName = require('@bem/sdk.entity-name');
const BemCell = require('@bem/sdk.cell');

const DirectedGraph = require('../../lib/directed-graph');

const vertex = new BemCell({ entity: new BemEntityName({ block: 'button' }) });

describe('directed-graph/add-vertex', () => {
    it('should be chainable', () => {
        const graph = new DirectedGraph();

        expect(graph.addVertex(vertex)).to.equal(graph);    });

    it('should add vertex', () => {
        const graph = new DirectedGraph();

        graph.addVertex(vertex);

        expect(graph.hasVertex(vertex)).to.be.ok;
    });

    it('should add the same vertex only one', () => {
        const graph = new DirectedGraph();

        graph.addVertex(vertex);
        graph.addVertex(vertex);

        const vertices = Array.from(graph.vertices());

        expect(vertices.length).to.equal(1);    });
});
