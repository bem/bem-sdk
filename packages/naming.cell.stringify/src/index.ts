import {
  stringify as stringifyEntity,
  type EntityLike,
  type NamingDelims as EntityNamingDelims,
} from '@bem/sdk.naming.entity.stringify';

import { buildPathStringify } from './path-stringify.js';
import type {
  BemCellLike,
  CellStringify,
  NamingConvention,
  NamingDelims,
} from './types.js';

export type {
  BemCellLike,
  CellStringify,
  FsConvention,
  NamingConvention,
  NamingDelims,
} from './types.js';

const DEFAULT_ELEM_DELIM = '__';
const DEFAULT_MOD_NAME_DELIM = '_';

interface ResolvedDelims {
  elem: string;
  modName: string;
  modVal: string;
}

function resolveDelims(conv: NamingConvention): ResolvedDelims {
  const root = conv.delims ?? {};
  const fs = conv.fs.delims ?? {};

  const rootMod = root.mod;
  const rootModName =
    typeof rootMod === 'string'
      ? rootMod
      : (rootMod?.name ?? DEFAULT_MOD_NAME_DELIM);
  const rootModVal =
    typeof rootMod === 'string'
      ? rootMod
      : (rootMod?.val ?? rootModName);

  const fsMod = fs.mod;
  const fsModName =
    fsMod === undefined
      ? rootModName
      : typeof fsMod === 'string'
        ? fsMod
        : (fsMod.name ?? rootModName);
  const fsModVal =
    fsMod === undefined
      ? rootModVal
      : typeof fsMod === 'string'
        ? fsMod
        : (fsMod.val ?? fsModName);

  return {
    elem: fs.elem ?? root.elem ?? DEFAULT_ELEM_DELIM,
    modName: fsModName,
    modVal: fsModVal,
  };
}

function buildSchemePrefix(
  scheme: string,
  delims: ResolvedDelims,
): (entity: EntityLike) => string {
  if (scheme !== 'nested') return () => '';

  return (entity) => {
    const block = entity.block;
    let out = `${block}/`;

    if (entity.elem) {
      out += `${delims.elem}${entity.elem}/`;
    }

    const mod = entity.mod;
    const modName = typeof mod === 'string' ? mod : mod?.name;
    if (modName) {
      out += `${delims.modName}${modName}/`;
    }

    return out;
  };
}

/**
 * Creates a stringifier that turns a `BemCell`-like object into a file path.
 *
 * @param conv  Naming convention with `fs.pattern`, optional `fs.scheme`,
 *              `fs.defaultLayer` and `delims`.
 */
export function cellStringifyWrapper(conv: NamingConvention): CellStringify {
  if (!conv || typeof conv !== 'object') {
    throw new Error(
      '@bem/sdk.naming.cell.stringify: convention object required',
    );
  }
  if (typeof conv.fs?.pattern !== 'string') {
    throw new Error(
      '@bem/sdk.naming.cell.stringify: fs.pattern field required in convention',
    );
  }

  const delims = resolveDelims(conv);
  const entityDelims: EntityNamingDelims = {
    elem: delims.elem,
    mod: { name: delims.modName, val: delims.modVal },
  };
  const pathStringify = buildPathStringify(conv.fs.pattern, conv.fs.defaultLayer);
  const schemePrefix = buildSchemePrefix(conv.fs.scheme, delims);

  return (cell: BemCellLike) => {
    if (!cell.tech) {
      throw new Error(
        `@bem/sdk.naming.cell.stringify: tech field required for stringifying (${cell.id ?? ''})`,
      );
    }

    return pathStringify({
      layer: cell.layer || 'common',
      tech: cell.tech,
      entity: schemePrefix(cell.entity) + stringifyEntity(cell.entity, entityDelims),
    });
  };
}

export default cellStringifyWrapper;
