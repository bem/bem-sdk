import { depsJsParser } from './formats/deps-js-parser.js';
import type { DepsLink, FileWithData } from './types.js';

export type Parser = (
  data: FileWithData | FileWithData[],
) => DepsLink[];

/**
 * Returns an async parser bound to a given format-specific parser.
 * Defaults to the `deps.js` parser.
 */
export function parse(parser: Parser = depsJsParser) {
  return async function (
    deps: FileWithData | FileWithData[],
  ): Promise<DepsLink[]> {
    return parser(deps);
  };
}

/**
 * Synchronous counterpart of {@link parse}. Useful when the caller already
 * has the file contents in memory and does not want to deal with promises
 * (closes #301).
 */
export function parseSync(parser: Parser = depsJsParser) {
  return function (deps: FileWithData | FileWithData[]): DepsLink[] {
    return parser(deps);
  };
}

export default parse;
