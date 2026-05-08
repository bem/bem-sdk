import { depsJsReader } from './formats/deps-js-reader.js';
import type { BemFile, FileWithData } from './types.js';

export type Reader = (file: BemFile) => Promise<FileWithData> | FileWithData;

/**
 * Generic serial reader generator.
 */
export function read(reader: Reader = depsJsReader) {
  return async function (files: BemFile[]): Promise<FileWithData[]> {
    const stack = [...files];
    const res: FileWithData[] = [];
    for (const f of stack) {
      res.push(await reader(f));
    }
    return res;
  };
}

export default read;
