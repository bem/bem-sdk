import { BemCell } from '@bem/sdk.cell';

import { VertexSet } from './vertex-set.js';
import { series } from './iter.js';
import { CircularDependencyError } from './circular-dependency-error.js';
import type { MixedGraph } from './mixed-graph.js';

class TopoGroups {
  private readonly _groups: Set<string>[] = [];
  private readonly _index = new Map<string, Set<string>>();

  lookup(id: string): Set<string> | undefined {
    return this._index.get(id);
  }

  lookupCreate(id: string): Set<string> {
    let group = this.lookup(id);
    if (!group) {
      group = new Set<string>([id]);
      this._index.set(id, group);
      this._groups.push(group);
    }
    return group;
  }

  merge(vertexId: string, parentId: string): void {
    const parentGroup = this.lookupCreate(parentId);
    const vertexGroup = this.lookup(vertexId);
    if (!vertexGroup) return;
    if (parentGroup !== vertexGroup) {
      for (const id of vertexGroup) {
        this._index.set(id, parentGroup);
        vertexGroup.delete(id);
        parentGroup.add(id);
      }
    }
  }
}

export function resolve(
  mixedGraph: MixedGraph,
  startVertices: BemCell[],
  tech?: string,
): Iterable<BemCell> {
  const positions: Record<string, number> = {};
  startVertices.forEach((e, pos) => {
    positions[e.id] = pos;
  });
  const backsort = (a: BemCell, b: BemCell): number =>
    (positions[a.id] ?? 0) - (positions[b.id] ?? 0);

  const orderedSuccessors: BemCell[] = [];
  const orderedVisits: Record<string, boolean | undefined> = {};
  const unorderedSuccessors = new VertexSet<BemCell>();
  let crumbs: BemCell[] = [];
  const topo = new TopoGroups();

  for (const v of startVertices) {
    visit(v, false);
  }

  const collected = new VertexSet<BemCell>();
  for (const v of orderedSuccessors.slice().reverse()) {
    collected.add(v);
  }

  const orderedArr = Array.from(collected);
  const unorderedArr = Array.from(unorderedSuccessors).sort(backsort);

  return series<BemCell>(orderedArr, unorderedArr);

  function visit(fromVertex: BemCell, isWeak: boolean): void {
    if (!isWeak && orderedVisits[fromVertex.id] === false) {
      if (
        crumbs.filter(
          (c) =>
            c.entity.id === fromVertex.entity.id &&
            (!c.tech || c.tech === fromVertex.tech),
        ).length
      ) {
        throw new CircularDependencyError(crumbs.concat(fromVertex));
      }
    }

    if (orderedVisits[fromVertex.id] !== undefined) {
      return;
    }

    crumbs.push(fromVertex);
    orderedVisits[fromVertex.id] = false;
    topo.lookupCreate(fromVertex.id);

    const orderedDirectSuccessors = mixedGraph.directSuccessors(fromVertex, {
      ordered: true,
      tech: fromVertex.tech || tech,
    });

    for (let successor of orderedDirectSuccessors) {
      if (!successor.tech && (tech || fromVertex.tech)) {
        successor = new BemCell({
          entity: successor.entity,
          tech: tech || fromVertex.tech,
        });
      }

      if (successor.id === fromVertex.id) continue;

      if (isWeak) {
        const topogroup = topo.lookup(successor.id);
        if (topogroup && !topogroup.has(fromVertex.id)) {
          for (const id of topo.lookup(successor.id)!) {
            orderedVisits[id] = undefined;
          }
        }
      }

      topo.merge(fromVertex.id, successor.id);
      visit(successor, false);
    }

    orderedVisits[fromVertex.id] = true;

    if (isWeak) {
      unorderedSuccessors.add(fromVertex);
    } else {
      orderedSuccessors.unshift(fromVertex);
    }

    const unorderedDirectSuccessors = mixedGraph.directSuccessors(fromVertex, {
      ordered: false,
      tech: fromVertex.tech || tech,
    });

    for (let successor of unorderedDirectSuccessors) {
      if (!successor.tech && (tech || fromVertex.tech)) {
        successor = new BemCell({
          entity: successor.entity,
          tech: tech || fromVertex.tech,
        });
      }

      if (
        successor.id === fromVertex.id ||
        orderedVisits[successor.id] ||
        unorderedSuccessors.has(successor) ||
        orderedSuccessors.indexOf(successor) !== -1
      ) {
        continue;
      }

      const savedCrumbs = crumbs;
      crumbs = [];
      visit(successor, true);
      crumbs = savedCrumbs;
    }

    crumbs.pop();
  }
}

export default resolve;
