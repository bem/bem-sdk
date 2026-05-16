import { BemCell } from '@bem/sdk.cell';

/**
 * Maps any value (single object or array) into an array of `BemCell`
 * instances using `BemCell.create`.
 */
export function cellify(data: unknown): BemCell[] {
  const arr = Array.isArray(data) ? data : [data];
  return arr.map((item) => BemCell.create(item as Parameters<typeof BemCell.create>[0]));
}

export default cellify;
