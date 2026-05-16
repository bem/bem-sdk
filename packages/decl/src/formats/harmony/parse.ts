import type { BemCell } from '@bem/sdk.cell';

import { normalize } from './normalize.js';

export function parse(data: { decl?: unknown }): BemCell[] {
  if (!Object.prototype.hasOwnProperty.call(data, 'decl')) {
    throw new Error('Invalid format of harmony declaration.');
  }
  return normalize(data.decl);
}

export default parse;
