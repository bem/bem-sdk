import { read, type Reader } from './read.js';
import { parse, type Parser } from './parse.js';
import { gather, type GatherOptions } from './gather.js';
import { depsJs } from './formats/deps-js.js';
import type { DepsFormat, DepsLink } from './types.js';

/**
 * Loads BEM dependencies from a config and returns a list of dependency links.
 */
export async function load(
  config: GatherOptions,
  format: DepsFormat = depsJs,
): Promise<DepsLink[]> {
  const files = await gather(config);
  const data = await read(format.reader as Reader)(files);
  return parse(format.parser as Parser)(data);
}

export default load;
