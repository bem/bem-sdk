import type { LangKeys } from '../langKeys.js';

export interface ParsedKeyValue {
  name: string;
  value: string | Record<string, ParsedKeyValue>;
  params: string[] | null;
}

export interface ParsedLangKeys {
  lang?: string;
  keysetName?: string;
  keys: Array<[string, string | Record<string, string>]>;
}

export interface KeyFormat {
  parse(
    name: string,
    value: string | Record<string, string>,
  ): ParsedKeyValue | Promise<ParsedKeyValue>;
}

export interface LangKeysFormat {
  stringify(langKeys: LangKeys): string;
  parse(str: string): ParsedLangKeys | Promise<ParsedLangKeys>;
}

export interface KeysetFormat {
  LangKeys: LangKeysFormat;
  Key: KeyFormat;
}
