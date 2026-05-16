import { promises as fs } from 'node:fs';
import nodeEval from 'node-eval';

import type { BemFile } from '@bem/sdk.file';
import type { FileWithData } from '../types.js';

/**
 * Reads and evaluates a `*.deps.js` file.
 */
export async function depsJsReader(file: BemFile): Promise<FileWithData> {
  const path = file.path ?? '';
  const content = await fs.readFile(path, 'utf8');
  const data = nodeEval(content, path);
  return Object.assign(file as object, { data }) as FileWithData;
}

export default depsJsReader;
