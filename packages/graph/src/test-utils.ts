import { BemCell } from '@bem/sdk.cell';
import { bemNaming } from '@bem/sdk.naming.entity';
import type { BemEntityName } from '@bem/sdk.entity-name';

import { BemGraph } from './bem-graph.js';

export type LinkMode = 'linkWith' | 'dependsOn';
export interface DepsMacroOptions {
  graph: (mode?: LinkMode) => BemGraph;
  test(graph: BemGraph): void;
}

export function depsMacro(obj: DepsMacroOptions): void {
  const fn = obj.graph;
  if (fn.length === 0) {
    obj.test(fn());
    return;
  }
  obj.test(fn('linkWith'));
  obj.test(fn('dependsOn'));
}

type EntityInput =
  | string
  | BemEntityName
  | { block: string; elem?: string; modName?: string; modVal?: unknown; mod?: unknown };

export function createVertex(entity: EntityInput, tech?: string): BemCell {
  let resolvedEntity: BemEntityName | EntityInput = entity;
  let resolvedTech = tech;
  if (typeof entity === 'string') {
    const p = entity.split('.');
    const parsed = bemNaming.parse(p[0]!);
    if (!parsed) {
      throw new Error(`createVertex: cannot parse "${entity}"`);
    }
    resolvedEntity = parsed;
    if (!resolvedTech) resolvedTech = p[1];
  }

  return BemCell.create({
    entity: resolvedEntity as BemEntityName,
    ...(resolvedTech ? { tech: resolvedTech } : {}),
  });
}

export interface DeclLike {
  entity: EntityInput;
  tech?: string;
}

function objIds(objs: ReadonlyArray<unknown>): string[] {
  return objs.map((o) => {
    if (typeof o !== 'object' || o === null) return '';
    const d = o as DeclLike;
    return createVertex(d.entity, d.tech).id;
  });
}

export function findIndex(
  objs: ReadonlyArray<unknown>,
  obj: unknown,
): number {
  if (typeof obj !== 'object' || obj === null) return -1;
  const target = obj as DeclLike;
  const vertex = createVertex(target.entity, target.tech);
  return objIds(objs).indexOf(vertex.id);
}

export function findLastIndex(
  objs: ReadonlyArray<unknown>,
  obj: unknown,
): number {
  if (typeof obj !== 'object' || obj === null) return -1;
  const target = obj as DeclLike;
  const vertex = createVertex(target.entity, target.tech);
  return objIds(objs).lastIndexOf(vertex.id);
}

export function simplifyVertices(
  items: Array<{ entity?: { valueOf(): unknown }; tech?: string }>,
): Array<{ entity?: unknown; tech?: string }> {
  return items.map((item) => {
    const res: { entity?: unknown; tech?: string } = {};
    if (item.entity) res.entity = item.entity.valueOf();
    if (item.tech) res.tech = item.tech;
    return res;
  });
}

export function createGraph(str: string): BemGraph {
  const graph = new BemGraph();
  const keyRe = /^[\w_.]+$/;
  const operatorRe = /^[-=]>$/;

  for (const raw of str.split(/[\n,]/g)) {
    const expr = raw.trim();
    if (!expr) continue;

    const exprs = (expr.match(/(\s*[\w_.]+\s*|\s*[-=]>\s*)/g) ?? [])
      .map((s) => s.trim())
      .filter(Boolean);

    if (
      !(exprs.length % 2) ||
      !exprs.every((s, i) => (i % 2 ? operatorRe : keyRe).test(s))
    ) {
      throw new Error(`Invalid format of graph expression: ${expr}`);
    }

    interface Edge {
      vertex: BemCell;
      dependOn: BemCell;
      ordered: boolean;
    }
    const edges: Edge[] = [];
    for (let i = 2; i < exprs.length; i += 2) {
      edges.push({
        vertex: createVertex(exprs[i - 2]!),
        dependOn: createVertex(exprs[i]!),
        ordered: exprs[i - 1] === '=>',
      });
    }

    for (const v of edges) {
      const vertex = graph.vertex(v.vertex.entity, v.vertex.tech);
      if (v.ordered) {
        vertex.dependsOn(v.dependOn.entity, v.dependOn.tech);
      } else {
        vertex.linkWith(v.dependOn.entity, v.dependOn.tech);
      }
    }
  }

  return graph;
}
