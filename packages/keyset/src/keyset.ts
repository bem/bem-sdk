import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { join, parse, resolve } from 'node:path';

import { formats } from './formats/index.js';
import { LangKeys, type FormatName } from './langKeys.js';
import type { Key } from './key.js';

export class Keyset {
  private _name = '';
  private _path = '';
  private _formatName: FormatName = 'taburet';
  private _errors: Error[] = [];
  private _isBroken = false;

  /** File extension for per-language files (depends on format). */
  langsKeysExt: string;

  /** Map<lang, LangKeys>. */
  private readonly _landKeys = new Map<string, LangKeys>();

  static availableFormats: Record<string, unknown> = formats;

  constructor(name: string, path?: string, format?: FormatName) {
    this.langsKeysExt = '.js';
    this.format = format ?? 'taburet';
    this.name = name;
    if (path) this.path = path;
  }

  get langKeys(): Map<string, LangKeys> {
    return this._landKeys;
  }

  get langs(): string[] {
    return [...this._landKeys.keys()];
  }

  get name(): string {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
    if (this._path) {
      const p = parse(this._path);
      this._path = join(p.dir, name + p.ext);
    }
  }

  get path(): string {
    return this._path;
  }

  set path(path: string) {
    if (!path) {
      this._path = '';
      return;
    }
    this._name = parse(path).name;
    this._path = path;
  }

  set format(format: FormatName) {
    if (!Keyset.availableFormats[format]) {
      throw new Error(
        `format ${format} is not valid, choose one of [${Object.keys(Keyset.availableFormats).join(',')}]`,
      );
    }
    this._formatName = format;
    if (format === 'enb') this.langsKeysExt = '.js';
    else if (format === 'taburet') this.langsKeysExt = '.ts';
  }

  get format(): FormatName {
    return this._formatName;
  }

  set isBroken(broken: boolean) {
    this._isBroken = broken;
    if (!broken) this._errors = [];
  }

  get isBroken(): boolean {
    this._isBroken = this._errors.length > 0;
    return this._isBroken;
  }

  get errors(): Error[] {
    return this._errors;
  }

  addKeysForLang(lang: string, keys: LangKeys): void {
    if (!(keys instanceof LangKeys)) {
      throw new Error('keys should be instance of LangKeys');
    }
    keys.keyset = this;
    this._landKeys.set(lang, keys);
  }

  getLangKeysForLang(lang: string): LangKeys | undefined {
    return this._landKeys.get(lang);
  }

  getKeysForLang(lang: string): Key[] | Record<string, never> {
    const langKeys = this.getLangKeysForLang(lang);
    return langKeys ? langKeys.keys : {};
  }

  async save(): Promise<void> {
    if (!this.path) {
      throw new Error('To save keyset, set it path');
    }
    try {
      await mkdir(this.path);
    } catch (err) {
      const e = err as NodeJS.ErrnoException;
      if (e.code === 'EEXIST') {
        const files = await readdir(resolve(this.path));
        for (const file of files) {
          await unlink(resolve(this.path, file));
        }
      } else {
        throw err;
      }
    }

    this.isBroken = false;
    for (const [lang, langKeys] of this._landKeys) {
      try {
        const filePath = resolve(this.path, lang + this.langsKeysExt);
        await writeFile(filePath, langKeys.stringify(this.format));
      } catch (err) {
        this._errors.push(err as Error);
      }
    }

    if (this.format === 'taburet') {
      const reExportStr = this.langs.reduce(
        (acc, langFile) => acc + `export * from './${langFile}';\n`,
        '',
      );
      const filePath = resolve(this.path, 'index' + this.langsKeysExt);
      try {
        await writeFile(filePath, reExportStr);
      } catch (err) {
        this._errors.push(err as Error);
      }
    }

    if (this.isBroken) {
      throw new Error('Keyset saved with errors');
    }
  }

  async load(): Promise<void> {
    this.isBroken = false;

    let files: string[] = [];
    try {
      files = await readdir(resolve(this.path));
    } catch {
      throw new Error(`${this.path} is not directory`);
    }

    for (const file of files) {
      const filePath = resolve(this.path, file);
      const lang = parse(file).name;
      if (lang === 'index') continue;

      let data: string | null = null;
      try {
        data = await readFile(filePath, 'utf8');
      } catch {
        this._errors.push(new Error(`${filePath} is broken`));
        continue;
      }

      let langKeys: LangKeys | null = null;
      try {
        langKeys = await LangKeys.parse(data, this.format);
        langKeys.lang = lang;
        langKeys.keysetName = this.name;
      } catch (err) {
        this._errors.push(err as Error);
        continue;
      }

      this.addKeysForLang(lang, langKeys);
    }

    if (this.isBroken) {
      throw new Error('Keyset loaded with errors');
    }
  }

  *[Symbol.iterator](): IterableIterator<[string, LangKeys]> {
    for (const entry of this._landKeys) yield entry;
  }

  /**
   * Merge a list of {@link Keyset}s into a new one (closes #350).
   *
   * - The result inherits `name`, `path` and `format` from the first
   *   argument.
   * - Each language present in any input is included in the result; keys
   *   are deduplicated by name and "last passed in wins".
   * - Inputs are not mutated.
   */
  static merge(...keysets: Keyset[]): Keyset {
    if (keysets.length === 0) {
      throw new Error('Keyset.merge requires at least one keyset');
    }
    const first = keysets[0]!;
    const result = new Keyset(first.name, first.path, first.format);
    const byLang = new Map<string, LangKeys[]>();
    for (const ks of keysets) {
      for (const lang of ks.langs) {
        const existing = byLang.get(lang) ?? [];
        const lk = ks.getLangKeysForLang(lang);
        if (lk) {
          existing.push(lk);
          byLang.set(lang, existing);
        }
      }
    }
    for (const [lang, parts] of byLang) {
      result.addKeysForLang(lang, LangKeys.merge(...parts));
    }
    return result;
  }

  /** Convenience: `ks.merge(...others)` ≡ `Keyset.merge(ks, ...others)`. */
  merge(...others: Keyset[]): Keyset {
    return Keyset.merge(this, ...others);
  }
}
