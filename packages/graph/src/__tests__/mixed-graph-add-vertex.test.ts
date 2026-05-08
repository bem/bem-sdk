import { expect } from 'chai';
import { BemEntityName } from '@bem/sdk.entity-name';
import { BemCell } from '@bem/sdk.cell';
import { MixedGraph } from '../mixed-graph.js';
const vertex = new BemCell({ entity: new BemEntityName({ block: 'button' }) });

describe('mixed-graph/add-vertex', () => {
    it('should be chainable', () => {
        const graph = new MixedGraph();

        expect(graph.addVertex(vertex)).to.equal(graph);    });

    it('should add vertex', () => {
        const graph = new MixedGraph();

        graph.addVertex(vertex);

        expect(graph.hasVertex(vertex)).to.be.ok;
    });

    it('should add the same vertex only one', () => {
        const graph = new MixedGraph();

        graph.addVertex(vertex);
        graph.addVertex(vertex);

        const vertices = Array.from(graph.vertices());

        expect(vertices.length).to.equal(1);    });
});
