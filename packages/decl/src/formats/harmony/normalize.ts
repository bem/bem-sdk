import { BemCell } from '@bem/sdk.cell';
import { BemEntityName } from '@bem/sdk.entity-name';

/* eslint-disable @typescript-eslint/no-explicit-any */
type AnyEntity = any;

function getMods(entity: AnyEntity): Record<string, unknown> | undefined {
  let mods = entity.mods;
  let modName = entity.modName;

  if (modName) {
    mods = {};
    mods[modName] = entity.modVal || true;
  }

  if (!mods) return undefined;
  if (!Array.isArray(mods)) return mods;

  const res: Record<string, unknown> = {};
  for (const m of mods) {
    res[m] = true;
  }
  return res;
}

export function normalize(decl: AnyEntity): BemCell[] {
  const res: BemCell[] = [];
  const hash: Record<string, true> = {};

  function add(rawEntity: AnyEntity): void {
    const entity = new BemEntityName(rawEntity);
    if (hash[entity.id]) return;
    hash[entity.id] = true;
    res.push(new BemCell({ entity }));
  }

  function normalizeMods(block: string, elem: string | null, mods: Record<string, unknown>): void {
    for (const modName of Object.keys(mods)) {
      let modVals = mods[modName] as unknown;
      if (typeof modVals !== 'object') modVals = [modVals];

      for (const modVal of modVals as unknown[]) {
        const resItem: AnyEntity = { block };
        if (elem) resItem.elem = elem;
        resItem.mod = { name: modName, val: modVal };
        add(resItem);
      }
    }
  }

  if (!decl) return [];
  const list: AnyEntity[] = Array.isArray(decl) ? decl : [decl];

  for (const entity of list) {
    let block: string | undefined;
    let mods: Record<string, unknown> | undefined;
    let elems: AnyEntity[] | undefined;

    if (typeof entity === 'string') {
      block = entity;
    } else {
      block = entity.block;
      mods = getMods(entity);
      elems = entity.elems
        ? entity.elems
        : entity.elem
          ? [{ elem: entity.elem, mods }]
          : undefined;
    }

    if (block) {
      add({ block });
    } else if (entity && entity.scope) {
      const scope = entity.scope;
      if (typeof scope === 'object') {
        block = scope.block;
        if (scope.elem && mods) {
          normalizeMods(block!, scope.elem, mods);
          break;
        }
      } else {
        block = scope;
      }
    }

    if (elems && block) {
      for (const elem of elems) {
        if (typeof elem === 'string') {
          add({ block, elem });
        } else {
          const elemName = elem.elem;
          const elemMods = getMods(elem);
          add({ block, elem: elemName });
          if (elemMods) normalizeMods(block, elemName, elemMods);
        }
      }
    }

    if (entity && !entity.elem && mods && block) {
      normalizeMods(block, null, mods);
    }
  }

  return res;
}

export default normalize;
