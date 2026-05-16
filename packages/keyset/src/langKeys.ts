import assert from 'node:assert';

import { Key, ParamedKey, PluralKey, type PluralForms } from './key.js';
import { formats } from './formats/index.js';

export type FormatName = 'taburet' | 'enb';

export class LangKeys {
  lang?: string | undefined;
  keysetName?: string | undefined;

  private readonly _keys: Set<Key>;

  /** Reference to a parent {@link Keyset}, set by {@link Keyset.addKeysForLang}. */
  keyset?: unknown;

  constructor(lang?: string, keys?: Iterable<Key>, keysetName?: string) {
    this.lang = lang;
    this.keysetName = keysetName;
    this._keys = new Set(keys ?? []);
  }

  get keys(): Key[] {
    return [...this._keys];
  }

  /**
   * Merges several `LangKeys` of the same language into a new instance.
   * Duplicates are deduplicated by `Key.name`; for clashes the last one
   * passed in wins. The first argument supplies metadata (`lang`,
   * `keysetName`) for the result.
   */
  static merge(...lks: LangKeys[]): LangKeys {
    if (lks.length === 0) {
      throw new Error('LangKeys.merge requires at least one LangKeys');
    }
    const first = lks[0]!;
    const byName = new Map<string, Key>();
    for (const lk of lks) {
      for (const key of lk.keys) byName.set(key.name, key);
    }
    return new LangKeys(first.lang, byName.values(), first.keysetName);
  }

  stringify(formatName: FormatName): string {
    return LangKeys.stringify(this, formatName);
  }

  static stringify(langKeys: LangKeys, formatName: FormatName): string {
    const format = formats[formatName];
    assert(format, `Unknown format: ${formatName}`);
    return format.LangKeys.stringify(langKeys);
  }

  static async parse(str: string, formatName: FormatName): Promise<LangKeys> {
    const format = formats[formatName];
    assert(format, `Unknown format: ${formatName}`);

    const { lang, keys: keysParsed, keysetName } = await format.LangKeys.parse(str);
    const keys = await Promise.all(
      keysParsed.map(async ([name, value]) => {
        const keyFormat = format.Key;
        const parsed = await keyFormat.parse(name, value);
        const { name: n, value: val, params } = parsed;

        if (typeof val === 'object') {
          const plural: PluralForms = {};
          for (const form of Object.keys(val) as Array<keyof PluralForms>) {
            const inner = val[form]!;
            const { name: _n, value: v, params: _params } = inner;
            plural[form] =
              _params != null
                ? new ParamedKey(_n, v as string, _params)
                : new Key(_n, v as string);
          }
          return new PluralKey(n, plural);
        }

        if (params != null) {
          return new ParamedKey(n, val, params);
        }
        return new Key(n, val);
      }),
    );

    return new LangKeys(lang, keys, keysetName);
  }
}
