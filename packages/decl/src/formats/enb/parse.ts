import type { BemCell } from '@bem/sdk.cell';

import { normalize } from './normalize.js';

export function parse(data: { deps?: unknown; decl?: unknown }): BemCell[] {
  if (!Object.prototype.hasOwnProperty.call(data, 'deps') && !Object.prototype.hasOwnProperty.call(data, 'decl')) {
    throw new Error('Invalid format of enb declaration.');
  }
  return normalize((data.deps ?? data.decl) as Parameters<typeof normalize>[0]);
}

export default parse;
