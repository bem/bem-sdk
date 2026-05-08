import type { BemCell } from '@bem/sdk.cell';

import { merge } from './merge.js';

/**
 * Subtracts cells from `collection` that appear in any of `removingSets`
 * (compared by `cell.id`).
 */
export function subtract(
  collection: BemCell[],
  ...removingSets: BemCell[][]
): BemCell[] {
  const removing =
    removingSets.length > 1
      ? merge(removingSets[0]!, ...removingSets.slice(1))
      : (removingSets[0] ?? []);

  const hash: Record<string, true> = {};
  for (const cell of removing) hash[cell.id] = true;

  return collection.filter((item) => !hash[item.id]);
}

export default subtract;
