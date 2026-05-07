import assert from 'node:assert';
import { isDeepStrictEqual } from 'node:util';

import uniqWith from 'lodash.uniqwith';

import type { SetChunk, SetDefinition } from './types.js';

export function resolveSets(
  sets: Record<string, SetDefinition>,
): Record<string, SetChunk[]> {
  const result: Record<string, SetChunk[]> = {};
  for (const setName of Object.keys(sets)) {
    result[setName] = uniqWith(
      resolveSet(sets[setName]!, setName, sets),
      isDeepStrictEqual,
    );
  }
  return result;
}

function resolveSet(
  setData: SetDefinition,
  setName: string,
  sets: Record<string, SetDefinition>,
): SetChunk[] {
  if (typeof setData !== 'string') {
    return Array.isArray(setData) ? setData : [setData];
  }

  const acc: SetChunk[] = [];
  for (const layerStr of setData.split(' ')) {
    if (!layerStr.includes('@')) {
      acc.push({ layer: layerStr });
      continue;
    }

    const [headRaw, tailRaw] = layerStr.split('@');
    let layerName = headRaw ?? '';
    let libName = tailRaw ?? '';

    if (!layerName) {
      const layerNameArr = libName.split('/');
      libName = layerNameArr.shift() ?? '';

      const level: SetChunk = { library: libName };

      if (layerNameArr.length) {
        level.layer = layerNameArr.join('/');
      } else {
        level.set = setName;
      }

      acc.push(level);
      continue;
    }

    assert(!libName.includes('/'), "You can't use set and layer simultaneously");

    if (!libName) {
      assert(sets[layerName], `Set \`${layerName}\` was not found`);
      acc.push(...resolveSet(sets[layerName]!, setName, sets));
      continue;
    }

    acc.push({ set: layerName, library: libName });
  }

  return acc;
}
