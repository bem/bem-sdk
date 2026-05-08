import debugFactory from 'debug';
import { BemCell } from '@bem/sdk.cell';
import type { BemEntityName } from '@bem/sdk.entity-name';

import { MixedGraph } from './mixed-graph.js';
import { resolve } from './mixed-graph-resolve.js';

const debug = debugFactory('@bem/sdk.graph');

export interface DependencyResult {
  entity: ReturnType<BemEntityName['valueOf']>;
  tech?: string;
}

type EntityInput = BemEntityName | { block: string; elem?: string; mod?: unknown } | string;

export class Vertex {
  graph: BemGraph;
  vertex: BemCell;

  constructor(graph: BemGraph, vertex: BemCell) {
    this.graph = graph;
    this.vertex = vertex;
  }

  linkWith(entity: EntityInput, tech?: string): this {
    const dependencyVertex = BemCell.create({ entity: entity as never, ...(tech ? { tech } : {}) });
    debug('link ' + this.vertex.id + ' -> ' + dependencyVertex.id);
    this.graph.mixedGraph.addEdge(this.vertex, dependencyVertex, {
      ordered: false,
    });
    return this;
  }

  dependsOn(entity: EntityInput, tech?: string): this {
    const dependencyVertex = BemCell.create({ entity: entity as never, ...(tech ? { tech } : {}) });
    debug('link ' + this.vertex.id + ' => ' + dependencyVertex.id);
    this.graph.mixedGraph.addEdge(this.vertex, dependencyVertex, {
      ordered: true,
    });
    return this;
  }
}

export class BemGraph {
  /** @internal */
  readonly mixedGraph = new MixedGraph();

  static Vertex = Vertex;

  vertex(entity: EntityInput, tech?: string): Vertex {
    const vertex = BemCell.create({ entity: entity as never, ...(tech ? { tech } : {}) });
    this.mixedGraph.addVertex(vertex);
    return new Vertex(this, vertex);
  }

  naturalDependenciesOf(
    entities: Array<EntityInput | { entity: EntityInput; tech?: string }>,
    tech?: string,
  ): DependencyResult[] {
    const cells = entities.map((e) => BemCell.create(e as never));
    return this.dependenciesOf(BemGraph._sortNaturally(cells), tech);
  }

  dependenciesOf(
    cells:
      | Array<EntityInput | BemCell | { entity: EntityInput; tech?: string }>
      | EntityInput
      | BemCell,
    tech?: string,
  ): DependencyResult[] {
    const list = Array.isArray(cells) ? cells : [cells];

    const vertices: BemCell[] = [];
    for (const cellData of list) {
      if (!cellData) continue;
      const cell = BemCell.create(cellData as never);
      vertices.push(cell);
      // Multiply techs
      if (tech && !cell.tech) {
        vertices.push(BemCell.create({ entity: cell.entity, tech }));
      }
    }

    const iter = resolve(this.mixedGraph, vertices, tech);
    const arr = Array.from(iter);

    const verticesCheckList: Record<string, true> = {};
    const result: DependencyResult[] = [];
    for (const vertex of arr) {
      const effectiveTech = vertex.tech || tech;
      const key = `${vertex.entity.id}.${effectiveTech ?? ''}`;
      if (verticesCheckList[key]) continue;
      const obj: DependencyResult = { entity: vertex.entity.valueOf() };
      if (effectiveTech) obj.tech = effectiveTech;
      verticesCheckList[`${vertex.entity.id}.${obj.tech ?? ''}`] = true;
      result.push(obj);
    }
    return result;
  }

  naturalize(): void {
    const mixedGraph = this.mixedGraph;
    const vertices = Array.from(mixedGraph.vertices());
    const index: Record<string, BemCell> = {};
    for (const vertex of vertices) {
      index[vertex.id] = vertex;
    }

    function hasOrderedDepend(vertex: BemCell, depend: BemCell): boolean {
      const orderedDirectSuccessors = mixedGraph.directSuccessors(vertex, {
        ordered: true,
      });
      for (const successor of orderedDirectSuccessors) {
        if (successor.id === depend.id) return true;
      }
      return false;
    }

    function addEdgeLosely(vertex: BemCell, key: string): boolean {
      const dependant = index[key];
      if (dependant) {
        if (hasOrderedDepend(dependant, vertex)) return false;
        mixedGraph.addEdge(vertex, dependant, { ordered: true });
        return true;
      }
      return false;
    }

    for (const vertex of vertices) {
      const entity = vertex.entity;
      if (entity.elem && entity.mod) {
        if (entity.mod.val !== true) {
          addEdgeLosely(
            vertex,
            `${entity.block}__${entity.elem}_${entity.mod.name}`,
          );
        }
        addEdgeLosely(vertex, `${entity.block}__${entity.elem}`) ||
          addEdgeLosely(vertex, entity.block);
      } else if (entity.elem) {
        addEdgeLosely(vertex, entity.block);
      } else if (entity.mod) {
        if (entity.mod.val !== true) {
          addEdgeLosely(vertex, `${entity.block}_${entity.mod.name}`);
        }
        addEdgeLosely(vertex, entity.block);
      }
    }
  }

  static _sortNaturally(entities: BemCell[]): BemCell[] {
    const order: Record<string, number> = {};
    let idx = 0;
    for (const e of entities) {
      order[e.id] = idx++;
    }

    let k = 1;
    for (const cell of entities) {
      const e = cell.entity;
      if (e.elem && !e.mod) {
        if (order[e.block] !== undefined) {
          order[cell.id] = order[e.block]! + 0.001 * k++;
        }
      }
    }

    for (const cell of entities) {
      const e = cell.entity;
      if (e.mod && e.mod.val === true) {
        let depId = `${e.block}__${e.elem ?? ''}`;
        if (order[depId] === undefined) depId = e.block;
        if (order[depId] !== undefined) {
          order[cell.id] = order[depId]! + 0.00001 * k++;
        }
      }
    }

    for (const cell of entities) {
      const e = cell.entity;
      if (e.mod && e.mod.val !== true) {
        let depId = e.elem
          ? `${e.block}__${e.elem}_${e.mod.name}`
          : `${e.block}_${e.mod.name}`;
        if (order[depId] === undefined && e.elem) {
          depId = `${e.block}__${e.elem}`;
        }
        if (order[depId] === undefined) depId = e.block;
        if (order[depId] !== undefined) {
          order[cell.id] = order[depId]! + 0.0000001 * k++;
        }
      }
    }

    return entities.sort((a, b) => (order[a.id] ?? 0) - (order[b.id] ?? 0));
  }
}

export default BemGraph;
