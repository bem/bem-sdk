import { readFile } from 'node:fs/promises';

import type { BemCell } from '@bem/sdk.cell';

import { parse } from './parse.js';

/**
 * Reads a bemdecl file and returns the parsed normalized declaration.
 *
 * Replaces legacy `graceful-fs` + `es6-promisify` with `node:fs/promises`.
 */
export async function load(
  filePath: string,
  encoding: BufferEncoding = 'utf-8',
): Promise<BemCell[]> {
  const content = await readFile(filePath, encoding);
  return parse(content);
}

export default load;
