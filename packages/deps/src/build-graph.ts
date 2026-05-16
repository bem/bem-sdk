import { BemGraph } from '@bem/sdk.graph';
import type { DepsLink } from './types.js';

export interface BuildGraphOptions {
  denaturalized?: boolean;
}

/**
 * Build a `BemGraph` from a list of dependency links.
 */
export function buildGraph(
  deps: DepsLink | DepsLink[],
  options: BuildGraphOptions = {},
): BemGraph {
  const graph = new BemGraph();
  const list: DepsLink[] = Array.isArray(deps) ? deps : [deps];

  for (const dep of list) {
    const v = dep.vertex as { entity: never; tech?: string };
    const target = dep.dependOn as { entity: never; tech?: string };
    const vertex = graph.vertex(v.entity, v.tech);
    if (dep.ordered) {
      vertex.dependsOn(target.entity, target.tech);
    } else {
      vertex.linkWith(target.entity, target.tech);
    }
  }

  if (!options.denaturalized) graph.naturalize();
  return graph;
}

export default buildGraph;
