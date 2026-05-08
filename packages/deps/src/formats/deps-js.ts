import { depsJsReader } from './deps-js-reader.js';
import { depsJsParser } from './deps-js-parser.js';
import type { DepsFormat } from '../types.js';

export const depsJs: DepsFormat = {
  reader: depsJsReader,
  parser: depsJsParser,
};

export default depsJs;
