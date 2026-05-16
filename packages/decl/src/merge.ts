import type { BemCell } from '@bem/sdk.cell';

/**
 * Unions any number of cell sets, deduplicating by `cell.id`.
 */
export function merge(collection: BemCell[], ...others: BemCell[][]): BemCell[] {
  const hash: Record<string, true> = {};
  const res: BemCell[] = collection.slice();

  for (const cell of res) hash[cell.id] = true;

  for (const set of others) {
    for (const cell of set) {
      if (hash[cell.id]) continue;
      res.push(cell);
      hash[cell.id] = true;
    }
  }

  return res;
}

export default merge;
