import { expect } from 'chai';
import { BemEntityName } from '@bem/sdk.entity-name';
import { BemCell } from '@bem/sdk.cell';

import { MixedGraph } from '../mixed-graph.js';

const vertex1 = new BemCell({
  entity: new BemEntityName({ block: 'button' }),
  tech: 'css',
});
const vertex2 = new BemCell({
  entity: new BemEntityName({ block: 'control' }),
  tech: 'css',
});

describe('mixed-graph/add-edge', () => {
  it('should be chainable', () => {
    const graph = new MixedGraph();
    expect(graph.addEdge(vertex1, vertex2)).to.equal(graph);
  });

  it('should add vertices', () => {
    const graph = new MixedGraph();
    graph.addEdge(vertex1, vertex2);
    expect(graph.hasVertex(vertex1)).to.equal(true);
    expect(graph.hasVertex(vertex2)).to.equal(true);
  });

  it('should record edge in unordered subgraph', () => {
    const graph = new MixedGraph();
    graph.addEdge(vertex1, vertex2, { ordered: false });
    const succ = Array.from(
      graph.directSuccessors(vertex1, { ordered: false, tech: 'css' }),
    );
    expect(succ.some((v) => v.id === vertex2.id)).to.equal(true);
  });

  it('should record edge in ordered subgraph', () => {
    const graph = new MixedGraph();
    graph.addEdge(vertex1, vertex2, { ordered: true });
    const succ = Array.from(
      graph.directSuccessors(vertex1, { ordered: true, tech: 'css' }),
    );
    expect(succ.some((v) => v.id === vertex2.id)).to.equal(true);
  });
});
