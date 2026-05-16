import type { BemCell } from '@bem/sdk.cell';

import { normalize } from './normalize.js';

export function parse(data: { blocks?: unknown }): BemCell[] {
  if (!Object.prototype.hasOwnProperty.call(data, 'blocks')) {
    throw new Error('Invalid format of v1 declaration.');
  }
  return normalize(data.blocks as Parameters<typeof normalize>[0]);
}

export default parse;
