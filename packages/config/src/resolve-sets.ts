import assert from 'node:assert';
import { isDeepStrictEqual } from 'node:util';

import uniqWith from 'lodash.uniqwith';

import type { SetChunk, SetDefinition, SetDefinitionItem } from './types.js';

/**
 * Resolves a record of set definitions into a record of flat `SetChunk[]`.
 *
 * A set definition is either:
 * - a string with space-separated tokens (legacy form);
 * - a single `SetChunk` object;
 * - a mixed array of strings and `SetChunk` objects (verbose form, #246).
 *
 * String tokens:
 * - `layer` — local layer reference.
 * - `set-name@` — recursive reference to a local set.
 * - `@lib` — reference to the set with the same name from `lib`.
 * - `@lib/layer` — reference to `layer` of `lib`.
 * - `set-name@lib` — reference to set `set-name` from `lib`.
 */
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
  if (Array.isArray(setData)) {
    const acc: SetChunk[] = [];
    for (const item of setData) acc.push(...resolveItem(item, setName, sets));
    return acc;
  }
  return resolveItem(setData, setName, sets);
}

function resolveItem(
  item: SetDefinitionItem,
  setName: string,
  sets: Record<string, SetDefinition>,
): SetChunk[] {
  if (typeof item === 'string') return resolveString(item, setName, sets);

  assert(
    item && typeof item === 'object',
    `Invalid set chunk in \`${setName}\`: expected string or object, got ${item === null ? 'null' : typeof item}`,
  );

  // Local set reference inside an array: `{ set: 'name' }` (no library) —
  // recursively expand against `sets`. Library refs are kept as-is so that
  // they can be resolved later against the corresponding library config.
  if (item.set && !item.library && !item.layer) {
    assert(sets[item.set], `Set \`${item.set}\` was not found`);
    return resolveSet(sets[item.set]!, setName, sets);
  }

  assert(
    item.layer || item.set || item.library,
    `Invalid set chunk in \`${setName}\`: must define at least one of \`layer\`, \`set\`, \`library\``,
  );
  assert(
    !(item.set && item.layer),
    `Invalid set chunk in \`${setName}\`: \`set\` and \`layer\` are mutually exclusive`,
  );
  return [{ ...item }];
}

function resolveString(
  setData: string,
  setName: string,
  sets: Record<string, SetDefinition>,
): SetChunk[] {
  const acc: SetChunk[] = [];
  for (const layerStr of setData.split(' ')) {
    if (!layerStr) continue;

    if (!layerStr.includes('@')) {
      acc.push({ layer: layerStr });
      continue;
    }

    const [headRaw, tailRaw] = layerStr.split('@');
    const layerName = headRaw ?? '';
    let libName = tailRaw ?? '';

    if (!layerName) {
      const layerNameArr = libName.split('/');
      libName = layerNameArr.shift() ?? '';

      const level: SetChunk = { library: libName };

      if (layerNameArr.length) {
        // `@lib/layer` — explicit library layer reference (#262).
        level.layer = layerNameArr.join('/');
      } else {
        // `@lib` — reference to the set with the same name in `lib`.
        level.set = setName;
      }

      acc.push(level);
      continue;
    }

    assert(
      !libName.includes('/'),
      `Invalid set token \`${layerStr}\` in \`${setName}\`: \`set@lib/layer\` form is not supported, use \`@lib/layer\` or \`set@lib\``,
    );

    if (!libName) {
      assert(sets[layerName], `Set \`${layerName}\` was not found`);
      acc.push(...resolveSet(sets[layerName]!, setName, sets));
      continue;
    }

    acc.push({ set: layerName, library: libName });
  }

  return acc;
}
