import { buildGraph } from './build-graph.js';
import type { DepsLink, ResolveOptions, ResolveResult } from './types.js';

/**
 * Resolves a declaration against a dependency graph.
 */
export function resolve(
  declaration: unknown[] = [],
  relations: DepsLink | DepsLink[] = [],
  options: ResolveOptions = {},
): ResolveResult {
  const graph = buildGraph(relations);
  const allEntities = Array.from(
    graph.dependenciesOf(
      declaration as never,
      options.tech as never,
    ),
  );

  const byTechIdx: Record<string, number> = {};
  const dependOn: ResolveResult['dependOn'] = [];
  if (options.tech) {
    for (const e of allEntities) {
      if (e.tech === options.tech) continue;
      const tech = e.tech ?? '';
      if (byTechIdx[tech] === undefined) {
        byTechIdx[tech] = dependOn.push({ tech, entities: [] }) - 1;
      }
      dependOn[byTechIdx[tech]!]!.entities.push(e.entity);
    }
  }

  const entities = allEntities
    .filter((e) => !options.tech || e.tech === options.tech)
    .map((e) => e.entity);

  return { entities, dependOn };
}

export default resolve;
