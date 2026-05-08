import type { BemCell } from '@bem/sdk.cell';

import { formats } from './formats/index.js';
import type { BemDeclFormat } from './types.js';

export interface FormatOptions {
  format?: BemDeclFormat | string;
}

/**
 * Formats a normalized declaration to the target format shape.
 */
export function format(decl: BemCell | BemCell[], opts: FormatOptions = {}): unknown {
  const formatName = opts.format;
  if (!formatName) throw new Error('You must declare target format');
  const fmt = formats[formatName];
  if (!fmt) throw new Error('Unknown format');
  return fmt.format(decl);
}

export default format;
