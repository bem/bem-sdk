// Originally these cases probed `MixedGraph._getSubgraph` and its private
// `_unordered/_orderedGraphMap` fields. After the TS migration those are
// private; the test is rewritten against the public API (addEdge +
// directSuccessors), preserving the four subgraph-isolation cases:
// (ordered|unordered) x (common-deps|tech-deps).
import { expect } from 'chai';
import { BemEntityName } from '@bem/sdk.entity-name';
import { BemCell } from '@bem/sdk.cell';

import { MixedGraph } from '../mixed-graph.js';

function cell(block: string, tech?: string): BemCell {
  return new BemCell({
    entity: new BemEntityName({ block }),
    ...(tech ? { tech } : {}),
  });
}

describe('mixed-graph/get-subgraph', () => {
  it('should return unordered subgraph with common deps', () => {
    const graph = new MixedGraph();
    const from = cell('button');
    const to = cell('control');

    graph.addEdge(from, to, { ordered: false });

    const unordered = Array.from(graph.directSuccessors(from, { ordered: false }));
    const ordered = Array.from(graph.directSuccessors(from, { ordered: true }));

    expect(unordered.map((v) => v.id)).to.include(to.id);
    expect(ordered).to.deep.equal([]);
  });

  it('should return ordered subgraph with common deps', () => {
    const graph = new MixedGraph();
    const from = cell('button');
    const to = cell('control');

    graph.addEdge(from, to, { ordered: true });

    const ordered = Array.from(graph.directSuccessors(from, { ordered: true }));
    const unordered = Array.from(graph.directSuccessors(from, { ordered: false }));

    expect(ordered.map((v) => v.id)).to.include(to.id);
    expect(unordered).to.deep.equal([]);
  });

  it('should return unordered subgraph with tech deps', () => {
    const graph = new MixedGraph();
    const from = cell('button', 'css');
    const to = cell('control', 'css');

    graph.addEdge(from, to, { ordered: false });

    const unorderedCss = Array.from(
      graph.directSuccessors(from, { ordered: false, tech: 'css' }),
    );
    const orderedCss = Array.from(
      graph.directSuccessors(from, { ordered: true, tech: 'css' }),
    );

    expect(unorderedCss.map((v) => v.id)).to.include(to.id);
    expect(orderedCss).to.deep.equal([]);
  });

  it('should return ordered subgraph with tech deps', () => {
    const graph = new MixedGraph();
    const from = cell('button', 'css');
    const to = cell('control', 'css');

    graph.addEdge(from, to, { ordered: true });

    const orderedCss = Array.from(
      graph.directSuccessors(from, { ordered: true, tech: 'css' }),
    );
    const unorderedCss = Array.from(
      graph.directSuccessors(from, { ordered: false, tech: 'css' }),
    );

    expect(orderedCss.map((v) => v.id)).to.include(to.id);
    expect(unorderedCss).to.deep.equal([]);
  });
});
