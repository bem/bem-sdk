import { BemCell } from '@bem/sdk.cell';
import { BemEntityName } from '@bem/sdk.entity-name';

import { assign } from '../../assign.js';

// Loose `any` is intentional in this file: it mirrors the legacy v2
// normaliser, which accepts highly polymorphic shapes (string / object /
// nested elem trees / mods array vs map). Tightening would require a major
// API redesign and is out of scope for this migration.
/* eslint-disable @typescript-eslint/no-explicit-any */

type AnyEntity = any;

function isNotActual(obj: AnyEntity): boolean {
  return !obj || (typeof obj === 'object' && Object.keys(obj).length === 0);
}

function getMod(entity: AnyEntity): Record<string, unknown> {
  const mod: Record<string, unknown> = {};
  if (!entity.mod) return mod;

  const val = Object.prototype.hasOwnProperty.call(entity, 'val')
    ? entity.val
    : true;
  if (val || val === 0) mod[entity.mod] = val;
  return mod;
}

function getMods(entity: AnyEntity): Record<string, unknown> {
  const mods: Record<string, unknown> = {};
  if (!entity.mods) return mods;

  if (Array.isArray(entity.mods)) {
    for (const name of entity.mods) mods[name] = true;
  } else {
    for (const name of Object.keys(entity.mods)) mods[name] = entity.mods[name];
  }
  return mods;
}

export function normalize(decl?: AnyEntity, scope?: BemCell | AnyEntity): BemCell[] {
  const res: BemCell[] = [];
  const hash: Record<string, true> = {};

  if (!decl) return res;

  let list: AnyEntity[];
  if (typeof decl === 'string' || !(Symbol.iterator in Object(decl))) {
    list = [decl];
  } else {
    list = Array.from(decl);
  }

  function add(rawEntity: AnyEntity, tech: string | null | undefined): void {
    const cell = cellify({ entity: rawEntity, tech });
    if (hash[cell.id]) return;
    hash[cell.id] = true;
    res.push(cell);
  }

  function cellify(data: { entity: AnyEntity; tech: string | null | undefined }): BemCell {
    if (scope) return assign(data, scope as BemCell);
    return new BemCell({
      entity: new BemEntityName(data.entity),
      ...(data.tech ? { tech: data.tech } : {}),
    });
  }

  function processMods(entity: {
    block: string | null;
    elem?: string;
    mods: Record<string, unknown>;
    tech?: string | null;
  }): void {
    const { block, elem, mods, tech } = entity;
    for (const mName of Object.keys(mods)) {
      let mVals = mods[mName] as unknown;
      if (!Array.isArray(mVals)) mVals = [mVals];

      for (const mVal of mVals as unknown[]) {
        const item: AnyEntity = { block };
        if (elem) item.elem = elem;

        if (typeof mVal !== 'boolean') {
          add({ ...item, mod: { name: mName, val: true } }, tech);
        }
        item.mod = { name: mName, val: mVal };
        add(item, tech);
      }
    }
  }

  for (const entity of list) {
    let block: string | null | undefined;
    let mod: Record<string, unknown> | undefined;
    let val: unknown;
    let mods: Record<string, unknown> | undefined;
    let elem: AnyEntity;
    let elems: AnyEntity;
    let tech: string | null | undefined;

    if (typeof entity === 'string') {
      block = entity;
    } else {
      tech = entity.tech || null;

      const keys = Object.keys(entity).filter((key) => key !== 'tech');
      if (keys.length === 0) {
        add({ block: null }, tech);
        continue;
      }
      block = entity.block || null;
      elem = entity.elem || null;
      elems = entity.elems;
      mod = getMod(entity);
      val = entity.val;
      mods = getMods(entity);
    }

    if (!block && (elems || (!isNotActual(mods) && isNotActual(elem)))) {
      add({}, tech);
    }

    if (block) {
      if (isNotActual(elem) && isNotActual(mod)) add({ block }, tech);
      if (!isNotActual(mod) && !elem) processMods({ block, mods: mod!, tech });
    }

    if (elem) {
      const elemList: AnyEntity[] = Array.isArray(elem) ? elem : [elem];
      for (const elItem of elemList) {
        if (typeof elItem === 'string') {
          if (isNotActual(mod)) add({ block, elem: elItem }, tech);
          if (!isNotActual(mod)) processMods({ block: block!, elem: elItem, mods: mod!, tech });
          if (!isNotActual(mods)) processMods({ block: block!, elem: elItem, mods: mods!, tech });
        } else {
          const elemNames: string[] = Array.isArray(elItem.elem) ? elItem.elem : [elItem.elem];
          const modsExists = !isNotActual(elItem.mods);
          for (const elemName of elemNames) {
            if (isNotActual(mod)) add({ block, elem: elemName }, tech);
            if (!isNotActual(mod)) processMods({ block: block!, elem: elemName, mods: mod!, tech });
            if (modsExists) processMods({ block: block!, elem: elemName, mods: elItem.mods, tech });
            if (!isNotActual(mods)) processMods({ block: block!, elem: elemName, mods: mods!, tech });
          }
        }
      }
    }

    if (!isNotActual(mod) && elems && !elem) processMods({ block: block!, mods: mod!, tech });
    if (!isNotActual(mods) && !elem) processMods({ block: block!, mods: mods!, tech });
    if (!isNotActual(mod) && !elems && !elem) processMods({ block: block!, mods: mod!, tech });

    if (elems) {
      const elemsList: AnyEntity[] = Array.isArray(elems) ? elems : [elems];
      for (const elItem of elemsList) {
        if (typeof elItem === 'string') {
          add({ block, elem: elItem }, tech);
        } else {
          const elemNames: string[] = Array.isArray(elItem.elem) ? elItem.elem : [elItem.elem];
          const elemMod = getMod(elItem);
          const elemMods = getMods(elItem);
          const hasMod = !isNotActual(elemMod);
          const hasMods = !isNotActual(elemMods);

          for (const elemName of elemNames) {
            if (hasMod) {
              processMods({ block: block!, elem: elemName, mods: elemMod, tech });
            } else {
              add({ block, elem: elemName }, tech);
            }
            if (hasMods) processMods({ block: block!, elem: elemName, mods: elemMods, tech });
          }
        }
      }
    }

    if (isNotActual(mod) && val) {
      const item: AnyEntity = { block };
      if (elem) item.elem = elem;
      if (typeof val !== 'boolean') {
        add({ ...item, mod: { val: true } }, tech);
      }
      item.mod = { name: null, val };
      add(item, tech);
    }
  }

  return res;
}

export default normalize;
