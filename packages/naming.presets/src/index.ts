import { legacy } from './legacy.js';
import { origin } from './origin.js';
import { originReact } from './origin-react.js';
import { react } from './react.js';
import { twoDashes } from './two-dashes.js';
import type { NamingConvention } from './types.js';

export type { NamingConvention, NamingDelims, FsConvention } from './types.js';
export { legacy, origin, originReact, react, twoDashes };

const PRESETS: Record<string, NamingConvention> = {
  legacy,
  origin,
  react,
  'origin-react': originReact,
  'two-dashes': twoDashes,
};

export interface CreateOptions {
  preset?: string;
  delims?: {
    elem?: string;
    mod?: string | { name: string; val: string };
  };
  fs?: Partial<NamingConvention['fs']>;
  wordPattern?: string;
}

const DEFAULT_PRESET: keyof typeof PRESETS = 'origin';

export function getPreset(name: string): NamingConvention {
  const preset = PRESETS[name];
  if (!preset) {
    throw new Error(`The \`${name}\` naming is unknown.`);
  }
  return preset;
}

export function create(
  options?: CreateOptions | string,
  userDefaults: CreateOptions | string = {},
): NamingConvention {
  if (options === undefined || options === null) {
    return PRESETS[DEFAULT_PRESET]!;
  }
  if (typeof options === 'string') {
    return getPreset(options);
  }

  const defaults: NamingConvention =
    PRESETS[options.preset ?? DEFAULT_PRESET] ?? PRESETS[DEFAULT_PRESET]!;

  const resolvedDefaults: CreateOptions =
    typeof userDefaults === 'string'
      ? (PRESETS[userDefaults] ?? PRESETS[DEFAULT_PRESET]!)
      : userDefaults;

  const defaultDelims = resolvedDefaults.delims ?? defaults.delims;
  const defaultModDelims =
    typeof defaultDelims.mod === 'string'
      ? { name: defaultDelims.mod, val: defaultDelims.mod }
      : (defaultDelims.mod ?? defaults.delims.mod);

  const optionsDelims = options.delims ?? {};
  const mod = optionsDelims.mod ?? defaultModDelims;

  const elem =
    optionsDelims.elem ??
    resolvedDefaults.delims?.elem ??
    defaults.delims.elem;

  return {
    delims: {
      elem,
      mod:
        typeof mod === 'string'
          ? { name: mod, val: mod }
          : {
              name: mod.name || defaultModDelims.name,
              val: mod.val || defaultModDelims.val,
            },
    },
    fs: { ...defaults.fs, ...resolvedDefaults.fs, ...options.fs },
    wordPattern:
      options.wordPattern ??
      resolvedDefaults.wordPattern ??
      defaults.wordPattern,
  };
}

export default create;
