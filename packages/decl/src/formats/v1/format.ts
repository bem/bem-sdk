import type { BemCell } from '@bem/sdk.cell';

interface ModItem {
  name: string;
  vals: { name: unknown }[];
}

interface BlockItem {
  name: string;
  mods?: ModItem[];
  elems?: ElemItem[];
}

interface ElemItem {
  name: string;
  mods?: ModItem[];
}

function appendMod(item: BlockItem | ElemItem, mod: { name: string; val: unknown } | undefined): void {
  if (!item.mods) item.mods = [];
  if (!mod) return;

  let modItem = item.mods.find((m) => m.name === mod.name);
  if (!modItem) {
    modItem = { name: mod.name, vals: [] };
    item.mods.push(modItem);
  }
  if ((mod.val && mod.val !== true) || mod.val === 0) {
    modItem.vals.push({ name: mod.val });
  }
}

/**
 * Renders a normalized declaration into the v1 nested-tree shape.
 */
export function format(decl: BemCell | BemCell[] | null | undefined): BlockItem[] {
  const list = Array.isArray(decl) ? decl : decl ? [decl] : [];
  if (!list.length) return [];

  const prev: { entity?: BemCell['entity']; group?: { entity?: BemCell['entity']; block?: BlockItem; elem?: ElemItem | null } } = {};

  return list.reduce<BlockItem[]>((res, cell) => {
    if (!cell) return res;

    const entity = cell.entity;
    const pg = prev.group;
    const group: { entity: BemCell['entity']; block?: BlockItem; elem?: ElemItem | null } = {
      entity,
      ...(pg?.block ? { block: pg.block } : {}),
      ...(pg?.elem !== undefined ? { elem: pg.elem } : {}),
    };

    let item: BlockItem | ElemItem;

    if (!group.block || group.block.name !== entity.block) {
      group.block = { name: entity.block };
      group.elem = null;
      res.push(group.block);
    }

    if (entity.elem) {
      if (!group.elem || group.elem.name !== entity.elem) {
        const elemItem: ElemItem = { name: entity.elem };
        group.elem = elemItem;
        if (!group.block.elems) group.block.elems = [];
        group.block.elems.push(elemItem);
        item = elemItem;
      } else {
        item = group.elem;
      }
    } else {
      item = group.block;
    }

    if (entity.mod) appendMod(item, entity.mod);

    Object.assign(prev, { entity, group });

    return res;
  }, []);
}

export default format;
