export { read, type Reader } from './read.js';
export { parse, parseSync, type Parser } from './parse.js';
export { gather, type GatherOptions } from './gather.js';
export { resolve } from './resolve.js';
export { buildGraph, type BuildGraphOptions } from './build-graph.js';
export { load } from './load.js';
export { depsJs } from './formats/deps-js.js';
export { depsJsReader } from './formats/deps-js-reader.js';
export { depsJsParser } from './formats/deps-js-parser.js';
export type {
  DepsFormat,
  DepsLink,
  FileWithData,
  ResolveOptions,
  ResolveResult,
  BemFile,
  BemCell,
  BemEntityName,
} from './types.js';

import { read } from './read.js';
import { parse, parseSync } from './parse.js';
import { gather } from './gather.js';
import { resolve } from './resolve.js';
import { buildGraph } from './build-graph.js';
import { load } from './load.js';

export default { read, parse, parseSync, gather, resolve, buildGraph, load };
