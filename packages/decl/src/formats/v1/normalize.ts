import { BemCell } from '@bem/sdk.cell';
import { BemEntityName } from '@bem/sdk.entity-name';

interface ModInput {
  name: string;
  vals?: { name: string }[];
}

interface ElemInput {
  name: string;
  mods?: ModInput[];
}

interface BlockInput {
  name: string;
  mods?: ModInput[];
  elems?: ElemInput[];
}

interface RawEntity {
  block: string;
  elem?: string;
  mod?: { name: string; val: string | true };
}

export function normalize(
  decl?: BlockInput | BlockInput[] | null,
): BemCell[] {
  const res: BemCell[] = [];
  const hash: Record<string, true> = {};

  function add(rawEntity: RawEntity): void {
    const entity = new BemEntityName(rawEntity);
    if (hash[entity.id]) return;
    hash[entity.id] = true;
    res.push(new BemCell({ entity }));
  }

  function normalizeMods(block: string, elem: string | null, mods: ModInput[]): void {
    for (const mod of mods) {
      const vals = mod.vals;
      const hasVals = vals ? vals.length : 0;

      let j = 0;
      do {
        const resItem: RawEntity = { block };
        if (elem) resItem.elem = elem;
        resItem.mod = {
          name: mod.name,
          val: hasVals && vals ? vals[j]!.name : true,
        };
        add(resItem);
        ++j;
      } while (j < hasVals);
    }
  }

  if (!decl) return [];
  const list = Array.isArray(decl) ? decl : [decl];

  for (const entity of list) {
    const block = entity.name;
    const mods = entity.mods;
    const elems = entity.elems;

    add({ block });

    if (mods) normalizeMods(block, null, mods);

    if (elems) {
      for (const elem of elems) {
        const elemName = elem.name;
        const elemMods = elem.mods;

        add({ block, elem: elemName });
        if (elemMods) normalizeMods(block, elemName, elemMods);
      }
    }
  }

  return res;
}

export default normalize;
