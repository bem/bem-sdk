// Typed promise wrapper around the CommonJS `xamel` package. The library is
// untyped and exposes a Node-style callback API; we only need a tiny subset.

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- xamel is CJS, no types
import xamel from 'xamel';

export interface XamelNode {
  name?: string;
  attrs?: Record<string, string>;
  children?: Array<XamelNode | string>;
  $(query: string): string;
}

export type XamelTree = XamelNode & {
  $(query: string): string;
  // The root tree exposes the same `$` selector, so it's compatible with XamelNode.
};

export interface XamelParseOptions {
  strict?: boolean;
  trim?: boolean;
}

type XamelCallback = (err: Error | null, xml: XamelTree) => void;
type XamelLib = {
  parse(str: string, options: XamelParseOptions, cb: XamelCallback): void;
};

export function parseXamel(
  str: string,
  options: XamelParseOptions = {},
): Promise<XamelTree> {
  return new Promise((resolve, reject) => {
    (xamel as unknown as XamelLib).parse(str, options, (err, xml) => {
      if (err) reject(err);
      else resolve(xml);
    });
  });
}
