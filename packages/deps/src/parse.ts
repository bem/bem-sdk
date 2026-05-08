import { depsJsParser } from './formats/deps-js-parser.js';
import type { DepsLink, FileWithData } from './types.js';

export type Parser = (
  data: FileWithData | FileWithData[],
) => DepsLink[];

export function parse(parser: Parser = depsJsParser) {
  return async function (
    deps: FileWithData | FileWithData[],
  ): Promise<DepsLink[]> {
    return parser(deps);
  };
}

export default parse;
