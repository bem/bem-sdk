import debugFactory from 'debug';
import { assign as declAssign, normalize as declNormalize } from '@bem/sdk.decl';

import type { DepsLink, FileWithData } from '../types.js';

const debug = debugFactory('@bem/sdk.deps');

interface DepsChunk {
  block?: string;
  elem?: string;
  mod?: string;
  val?: unknown;
  tech?: string;
  elems?: unknown;
  mods?: unknown;
  mustDeps?: unknown;
  shouldDeps?: unknown;
  noDeps?: unknown;
}

/**
 * @internal Parses an array of `deps.js`-format file payloads into edges.
 */
export function depsJsParser(
  depsData: FileWithData | FileWithData[],
): DepsLink[] {
  const records = Array.isArray(depsData) ? depsData : [depsData];

  const mustDeps: DepsLink[] = [];
  const shouldDeps: DepsLink[] = [];
  const mustDepsIndex: Record<string, true> = {};
  const shouldDepsIndex: Record<string, true> = {};

  for (const record of records) {
    const scope =
      record.scope ?? ({ entity: record.entity } as { entity: unknown });
    if (!record.data) continue;

    const data: DepsChunk[] = Array.isArray(record.data)
      ? (record.data as DepsChunk[])
      : [record.data as DepsChunk];

    for (const dep of data) {
      const subscope = declAssign(
        {
          entity: {
            block: dep.block,
            elem: dep.elem,
            mod: dep.mod ? { name: dep.mod, val: dep.val } : undefined,
          },
          tech: dep.tech,
        } as never,
        scope as never,
      ) as never as { id: string; entity: unknown; tech?: string };
      const subscopeKey = subscope.id;

      if (dep.mustDeps) {
        for (const nd of declNormalize(dep.mustDeps, {
          format: 'v2',
          scope: subscope as never,
        })) {
          const ndAssigned = declAssign(nd as never, subscope as never) as never as {
            id: string;
            entity: unknown;
            tech?: string;
          };
          const key = ndAssigned.id;
          const indexKey = subscopeKey + '→' + key;
          if (!mustDepsIndex[indexKey]) {
            if (subscopeKey !== key) {
              mustDeps.push({
                vertex: subscope as never,
                dependOn: ndAssigned as never,
                ordered: true,
                ...(record.path ? { path: record.path } : {}),
              });
            }
            mustDepsIndex[indexKey] = true;
          }
        }
      }

      if (dep.shouldDeps) {
        for (const nd of declNormalize(dep.shouldDeps, {
          format: 'v2',
          scope: subscope as never,
        })) {
          const ndCell = nd as never as {
            id: string;
            entity: unknown;
            tech?: string;
          };
          const key = ndCell.id;
          const indexKey = subscopeKey + '→' + key;
          if (!shouldDepsIndex[indexKey]) {
            if (subscopeKey !== key) {
              shouldDeps.push({
                vertex: subscope as never,
                dependOn: ndCell as never,
                ...(record.path ? { path: record.path } : {}),
              });
            }
            shouldDepsIndex[indexKey] = true;
          }
        }
      }

      if (dep.noDeps) {
        for (const nd of declNormalize(dep.noDeps, {
          format: 'v2',
          scope: subscope as never,
        })) {
          const ndCell = nd as never as {
            id: string;
            tech?: string;
          };
          const key = ndCell.id;
          const indexKey = subscopeKey + '→' + key;
          removeFromDeps(key, indexKey, mustDepsIndex, mustDeps);
          removeFromDeps(key, indexKey, shouldDepsIndex, shouldDeps);
        }
      }
    }
  }

  function declKey(nd: { entity: { id: string }; tech?: string }): string {
    return nd.tech ? `${nd.entity.id}.${nd.tech}` : nd.entity.id;
  }

  function removeFromDeps(
    key: string,
    indexKey: string,
    index: Record<string, true>,
    list: DepsLink[],
  ): DepsLink[] | null {
    if (index[indexKey]) {
      for (let i = 0, l = list.length; i < l; i++) {
        if (
          declKey(
            list[i]!.dependOn as never as { entity: { id: string }; tech?: string },
          ) === key
        ) {
          return list.splice(i, 1);
        }
      }
    } else {
      index[indexKey] = true;
    }
    return null;
  }

  if (debug.enabled) {
    debug(
      'parsed-deps: ' +
        mustDeps
          .concat(shouldDeps)
          .map((v) => {
            const vId = (v.vertex as never as { id?: string }).id ?? '';
            const dId = (v.dependOn as never as { id?: string }).id ?? '';
            return `${vId} ${v.ordered ? '=>' : '->'} ${dId} : ${v.path ?? ''}`;
          })
          .join('\n'),
    );
  }

  return mustDeps.concat(shouldDeps);
}

export default depsJsParser;
