import type { BemCell } from '@bem/sdk.cell';

import { normalize as normalizeV1 } from './formats/v1/normalize.js';
import { normalize as normalizeV2 } from './formats/v2/normalize.js';
import { normalize as normalizeEnb } from './formats/enb/normalize.js';
import { normalize as normalizeHarmony } from './formats/harmony/normalize.js';
import type { NormalizeOptions } from './types.js';

const normalizers: Record<string, (decl: unknown, scope?: BemCell) => BemCell[]> = {
  v1: (decl) => normalizeV1(decl as Parameters<typeof normalizeV1>[0]),
  v2: (decl, scope) => normalizeV2(decl, scope),
  harmony: (decl) => normalizeHarmony(decl),
  enb: (decl) => normalizeEnb(decl as Parameters<typeof normalizeEnb>[0]),
};

export function normalize(decl: unknown, opts: NormalizeOptions = {}): BemCell[] {
  const format = opts.format ?? 'v2';
  const fn = normalizers[format];
  if (!fn) throw new Error(`Unknown format: ${format}`);
  return fn(decl, opts.scope);
}

export default normalize;
