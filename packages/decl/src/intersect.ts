import type { BemCell } from '@bem/sdk.cell';

/**
 * Intersects any number of cell sets — keeps only cells that are present
 * in every input set (compared by `cell.id`).
 */
export function intersect(...sets: BemCell[][]): BemCell[] {
  const hash: Record<string, number> = {};
  const res: BemCell[] = [];
  const setsQty = sets.length;

  for (const set of sets) {
    for (const cell of set) {
      hash[cell.id] = (hash[cell.id] ?? 0) + 1;
      if (hash[cell.id] === setsQty) res.push(cell);
    }
  }

  return res;
}

export default intersect;
