import nodeEval from 'node-eval';

import type { BemCell } from '@bem/sdk.cell';

import { detect } from './detect.js';
import { formats } from './formats/index.js';

/**
 * Parses BEMDECL data — accepts either a string (JS source returning the
 * decl object via `node-eval`) or an already-parsed object.
 */
export function parse(bemdecl: string | object): BemCell[] {
  if (typeof bemdecl !== 'object' && typeof bemdecl !== 'string') {
    throw new Error('Bemdecl must be String or Object');
  }

  const data =
    typeof bemdecl === 'string'
      ? (nodeEval(bemdecl) as { format?: string; [key: string]: unknown })
      : (bemdecl as { format?: string; [key: string]: unknown });

  const formatName = data.format ?? detect(data);
  const fmt = formatName ? formats[formatName] : undefined;
  if (!fmt) throw new Error('Unknown BEMDECL format.');

  return fmt.parse(data) as BemCell[];
}

export default parse;
