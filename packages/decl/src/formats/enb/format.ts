import type { BemCell } from '@bem/sdk.cell';

interface EnbItem {
  block: string;
  elem?: string;
  mod?: string;
  val?: string | true;
  tech?: string;
}

/**
 * Format normalized declaration to enb shape.
 */
export function format(cells: BemCell | BemCell[]): EnbItem[] {
  const list = Array.isArray(cells) ? cells : [cells];
  return list.map((cell) => {
    const entity = cell.entity;
    const tmp: EnbItem = { block: entity.block };
    if (entity.elem) tmp.elem = entity.elem;

    if (entity.mod) {
      tmp.mod = entity.mod.name;
      if (entity.mod.val !== true) tmp.val = entity.mod.val as string | true;
    }

    if (cell.tech) tmp.tech = cell.tech;
    return tmp;
  });
}

export default format;
