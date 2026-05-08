import stringifyObject from 'stringify-object';
import { normalize } from '@bem/sdk.decl';
import { BemEntityName } from '@bem/sdk.entity-name';
import type { EntityRepresentation } from '@bem/sdk.entity-name';

export interface Bemjson {
  block?: string;
  elem?: string;
  mods?: Record<string, unknown>;
  elemMods?: Record<string, unknown>;
  mix?: Bemjson | Bemjson[];
  content?: Bemjson | Bemjson[] | null;
  js?: Record<string, Bemjson | Bemjson[]>;
  attrs?: Record<string, Bemjson | Bemjson[]>;
  [key: string]: unknown;
}

export interface ConvertContext {
  block?: string;
}

export interface StringifyOptions {
  indent?: string;
  [key: string]: unknown;
}

const SKIP_KEYS = new Set(['js', 'attrs', 'mods', 'elemMods', 'block', 'elem']);

function pushTo(
  entity: BemEntityName,
  deps: BemEntityName[],
  visited: Record<string, true>,
): void {
  if (!visited[entity.id]) {
    visited[entity.id] = true;
    deps.push(entity);
  }
}

/**
 * Walks BEM JSON and collects all referenced entities as `BemEntityName`s.
 */
export function convert(
  bemjson: unknown,
  ctx: ConvertContext = {},
): BemEntityName[] {
  const visited: Record<string, true> = {};

  function walk(node: unknown, parentCtx: ConvertContext): BemEntityName[] {
    const localCtx: ConvertContext = { ...parentCtx };
    let deps: BemEntityName[] = [];

    if (Array.isArray(node)) {
      for (const item of node) {
        const sub = walk(item, localCtx);
        if (sub) deps = deps.concat(sub);
      }
      return deps;
    }

    if (!node || typeof node !== 'object') {
      return deps;
    }

    const obj = node as Bemjson;
    if (obj.block) localCtx.block = obj.block;

    const declItem: Record<string, unknown> = { block: localCtx.block };
    if (obj.elem) declItem.elem = obj.elem;
    if (obj.elem) {
      if (obj.elemMods) declItem.mods = obj.elemMods;
    } else if (obj.mods) {
      declItem.mods = obj.mods;
    }

    // The legacy code passed `{ harmony: true }` to `normalize`, but this
    // never matched the explicit `format` switch — so the legacy default `v2`
    // format was used in practice. Stay on v2 to preserve behavior.
    const decl = normalize(declItem, { format: 'v2' });
    for (const cell of decl) {
      const entity = new BemEntityName(
        cell.entity.valueOf() as EntityRepresentation,
      );
      pushTo(entity, deps, visited);

      if (entity.isSimpleMod() === false) {
        // For non-simple mods also expose the mod name as a separate key
        // matching legacy behavior of `_pushTo` with `modVal: true`.
        const flatBase = {
          ...declItem,
          modVal: true,
        } as Record<string, unknown>;
        pushTo(
          BemEntityName.create(flatBase as never),
          deps,
          visited,
        );
      }
    }

    for (const k of ['js', 'attrs'] as const) {
      const bag = obj[k];
      if (bag && typeof bag === 'object') {
        for (const kk of Object.keys(bag)) {
          const sub = walk((bag as Record<string, unknown>)[kk], localCtx);
          if (sub) deps = deps.concat(sub);
        }
      }
    }

    for (const key of Object.keys(obj)) {
      if (SKIP_KEYS.has(key)) continue;
      const value = obj[key];
      const items: unknown[] = Array.isArray(value) ? value : [value];
      for (const ent of items) {
        const sub = walk(ent, localCtx);
        if (sub) deps = deps.concat(sub);
      }
    }

    return deps.filter(Boolean);
  }

  return walk(bemjson, ctx);
}

/**
 * Stringifies a BEM JSON description as a JSON-like representation of the
 * entities it references.
 */
export function stringify(
  bemjson: unknown,
  ctx: ConvertContext = {},
  opts: StringifyOptions = {},
): string {
  const { indent = '    ', ...rest } = opts;
  return stringifyObject(
    convert(bemjson, ctx).map((entity) => entity.toJSON()),
    { indent, ...rest },
  );
}

export default { convert, stringify };
