import JSON5 from 'json5';

import type { BemCell } from '@bem/sdk.cell';

import { format } from './format.js';
import type { ExportType, StringifyOptions } from './types.js';

const DEFAULTS = { exportType: 'json' as ExportType, space: 4 as string | number };

const fieldByFormat: Record<string, string> = {
  v1: 'blocks',
  enb: 'deps',
  v2: 'deps',
};

type Generator = (obj: unknown, space: string | number) => string;

const generators: Record<string, Generator> = {
  json5: (obj, space) => JSON5.stringify(obj, null, space),
  json: (obj, space) => JSON.stringify(obj, null, space),
  commonjs: (obj, space) =>
    `module.exports = ${JSON5.stringify(obj, null, space)};\n`,
  es2015: (obj, space) => `export default ${JSON5.stringify(obj, null, space)};\n`,
};
generators['es6'] = generators['es2015']!;
generators['cjs'] = generators['commonjs']!;

/**
 * Renders a normalized declaration as a string in the requested format.
 */
export function stringify(
  decl: BemCell | BemCell[],
  opts: StringifyOptions = {},
): string {
  const options = { ...DEFAULTS, ...opts };

  if (!options.format) throw new Error('You must declare target format');
  if (!Object.prototype.hasOwnProperty.call(fieldByFormat, options.format)) {
    throw new Error("Specified format isn't supported");
  }
  if (!Object.prototype.hasOwnProperty.call(generators, options.exportType)) {
    throw new Error("Specified export type isn't supported");
  }

  const list = Array.isArray(decl) ? decl : [decl];
  const formattedDecl = format(list, { format: options.format });
  const field = fieldByFormat[options.format];

  const stringifiedObj: Record<string, unknown> = field
    ? { format: options.format, [field]: formattedDecl }
    : (formattedDecl as Record<string, unknown>);

  return generators[options.exportType]!(stringifiedObj, options.space);
}

export default stringify;
