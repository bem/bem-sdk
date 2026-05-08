import { writeFile } from 'node:fs/promises';

import type { BemCell } from '@bem/sdk.cell';

import { stringify } from './stringify.js';
import type { StringifyOptions } from './types.js';

export interface SaveOptions extends StringifyOptions {
  /** File mode (default: kept implicit by `node:fs/promises`). */
  mode?: number;
}

/**
 * Saves a normalized declaration to a file in the requested format.
 *
 * Replaces legacy `fs` + `es6-promisify` with `node:fs/promises`.
 */
export async function save(
  filename: string,
  cells: BemCell | BemCell[],
  opts: SaveOptions = {},
): Promise<void> {
  const options: StringifyOptions = {
    format: opts.format ?? 'v2',
    exportType: opts.exportType ?? 'cjs',
    ...(opts.space !== undefined ? { space: opts.space } : {}),
  };

  const str = stringify(cells, options);
  await writeFile(filename, str, opts.mode !== undefined ? { mode: opts.mode } : undefined);
}

export default save;
