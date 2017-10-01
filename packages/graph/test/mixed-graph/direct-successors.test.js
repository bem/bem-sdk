'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;


const MixedGraph = require('../../lib/mixed-graph');

const createVertex = require('../../lib/test-utils').createVertex;

describe('mixed-graph/direct-successors', () => {
    it('should return empty set if no successors', () => {
        const graph = new MixedGraph();
        const vertex = createVertex({ block: 'button' });

        const successors = graph.directSuccessors(vertex);

        expect(Array.from(successors)).to.deep.equal([]);
    });

    it('should return successors for unordered graph', () => {
        const graph = new MixedGraph();
        const vertex1 = createVertex({ block: 'button' });
        const vertex2 = createVertex({ block: 'control' });

        graph.addEdge(vertex1, vertex2);

        const successors = graph.directSuccessors(vertex1);

        expect(Array.from(successors)).to.deep.equal([vertex2]);
    });

    it('should return successors for ordered graph', () => {
        const graph = new MixedGraph();
        const vertex1 = createVertex({ block: 'button' });
        const vertex2 = createVertex({ block: 'control' });

        graph.addEdge(vertex1, vertex2, { ordered: true });

        const successors = graph.directSuccessors(vertex1, { ordered: true });

        expect(Array.from(successors)).to.deep.equal([vertex2]);
    });

    it('should return successors for mixed one-level graph', () => {
        const graph = new MixedGraph();
        const vertex1 = createVertex({ block: 'button' });
        const vertex2 = createVertex({ block: 'control' });
        const vertex3 = createVertex({ block: 'icon' });

        graph.addEdge(vertex1, vertex2);
        graph.addEdge(vertex1, vertex3, { ordered: true });

        const successors = graph.directSuccessors(vertex1);

        expect(Array.from(successors)).to.deep.equal([vertex2]);

        const successors2 = graph.directSuccessors(vertex1, { ordered: true });

        expect(Array.from(successors2)).to.deep.equal([vertex3]);
    });

    it('should return successors for mixed one-level graph (ordered first)', () => {
        const graph = new MixedGraph();
        const vertex1 = createVertex({ block: 'button' });
        const vertex2 = createVertex({ block: 'control' });
        const vertex3 = createVertex({ block: 'icon' });

        graph.addEdge(vertex1, vertex2, { ordered: true });
        graph.addEdge(vertex1, vertex3);

        const successors = graph.directSuccessors(vertex1);

        expect(Array.from(successors)).to.deep.equal([vertex3]);

        const successors2 = graph.directSuccessors(vertex1, { ordered: true });

        expect(Array.from(successors2)).to.deep.equal([vertex2]);
    });

    it('should return successors with tech', () => {
        const graph = new MixedGraph();
        const vertex1 = createVertex({ block: 'attach' });
        const vertex2 = createVertex({ block: 'button' });
        const vertex3 = createVertex({ block: 'button' }, 'css');

        graph.addEdge(vertex1, vertex2);
        graph.addEdge(vertex1, vertex3);

        const successors = graph.directSuccessors(vertex1);

        expect(Array.from(successors)).to.deep.equal([vertex2, vertex3]);
    });

    it('should return successors for mixed one-level  graph (ordered first)', () => {
        const graph = new MixedGraph();
        const vertex1 = createVertex({ block: 'attach' }, 'css');
        const vertex2 = createVertex({ block: 'button' });

        graph.addEdge(vertex1, vertex2);

        const successors = graph.directSuccessors(vertex1, { tech: 'css' });

        expect(Array.from(successors)).to.deep.equal([vertex2]);
    });
});
