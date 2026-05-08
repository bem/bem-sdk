import { bemNamingEntityParse, type EntityParse } from '@bem/sdk.naming.entity.parse';
import { stringifyWrapper, type Stringify } from '@bem/sdk.naming.entity.stringify';
import {
  create as createPreset,
  type CreateOptions,
  type NamingConvention,
} from '@bem/sdk.naming.presets';

export interface BemNaming {
  parse: EntityParse;
  stringify: Stringify;
  delims: NamingConvention['delims'];
  wordPattern: string;
}

const cache = new Map<string, BemNaming>();

/**
 * Creates a namespace with `parse` / `stringify` / `delims` / `wordPattern`
 * for the given naming convention. Same options yield the same instance.
 */
function createNaming(options?: CreateOptions | string): BemNaming {
  const opts = createPreset(options as CreateOptions | string | undefined);
  const id = JSON.stringify(opts);

  const cached = cache.get(id);
  if (cached) return cached;

  const namespace: BemNaming = {
    parse: bemNamingEntityParse(opts),
    stringify: stringifyWrapper(opts),
    delims: opts.delims,
    wordPattern: opts.wordPattern,
  };

  cache.set(id, namespace);
  return namespace;
}

export type BemNamingFactory = typeof createNaming & BemNaming;

const defaultNaming = createNaming();
const factory = createNaming as BemNamingFactory;
factory.parse = defaultNaming.parse;
factory.stringify = defaultNaming.stringify;
factory.delims = defaultNaming.delims;
factory.wordPattern = defaultNaming.wordPattern;

export { factory as bemNaming };
export default factory;
