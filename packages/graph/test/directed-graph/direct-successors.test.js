'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;


const BemEntityName = require('@bem/sdk.entity-name');
const BemCell = require('@bem/sdk.cell');

const DirectedGraph = require('../../lib/directed-graph');

describe('directed-graph/direct-successors', () => {
    it('should return successors', () => {
        const graph = new DirectedGraph();
        const vertex1 = new BemCell({ entity: new BemEntityName({ block: 'button' }) });
        const vertex2 = new BemCell({ entity: new BemEntityName({ block: 'control' }) });

        graph.addEdge(vertex1, vertex2);

        const successors = graph.directSuccessors(vertex1);

        expect(Array.from(successors)).to.deep.equal([vertex2]);
    });

    it('should return empty set if no successors', () => {
        const graph = new DirectedGraph();
        const vertex = new BemCell({ entity: new BemEntityName({ block: 'button' }) });

        const successors = graph.directSuccessors(vertex);

        expect(Array.from(successors)).to.deep.equal([]);
    });
});
