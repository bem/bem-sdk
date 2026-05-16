import { BemCell } from '@bem/sdk.cell';
import { BemEntityName } from '@bem/sdk.entity-name';

interface EnbItem {
  block: string;
  elem?: string;
  mod?: string;
  val?: string | true;
  tech?: string;
}

export function normalize(items: EnbItem[]): BemCell[] {
  return items.map((item) => {
    const entityObj: { block: string; elem?: string; mod?: { name: string; val?: string | true } } = {
      block: item.block,
    };
    if (item.elem) entityObj.elem = item.elem;
    if (item.mod) {
      const mod: { name: string; val?: string | true } = { name: item.mod };
      if (item.val) mod.val = item.val;
      entityObj.mod = mod;
    }

    return new BemCell({
      entity: new BemEntityName(entityObj),
      ...(item.tech ? { tech: item.tech } : {}),
    });
  });
}

export default normalize;
