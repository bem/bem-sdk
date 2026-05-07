import assert from 'node:assert';

import nEval from 'node-eval';

import type { LangKeys } from '../langKeys.js';
import type {
  KeyFormat,
  KeysetFormat,
  LangKeysFormat,
  ParsedKeyValue,
  ParsedLangKeys,
} from './types.js';

const langKeysFormat: LangKeysFormat = {
  stringify(langKeys: LangKeys): string {
    const keys = langKeys.keys.reduce<Record<string, unknown>>((acc, key) => {
      acc[key.name] = key.value;
      return acc;
    }, {});
    const replacer = (_k: string, v: unknown): unknown => {
      if (typeof v === 'string') {
        return v.replace(/"/g, '__*') + ',,';
      }
      return v;
    };
    const keysStr = JSON.stringify(keys, replacer, 4)
      .replace(/"/g, "'")
      .replace(/__\*/g, '"')
      .replace(/,,'/g, "',")
      .replace(/,,/g, ',')
      .replace(/}\n/g, '},\n');

    return `export const ${langKeys.lang} = ${keysStr};\n`;
  },

  async parse(str: string): Promise<ParsedLangKeys> {
    const strToParse = str.replace('export const ', 'module.exports.');

    let data: Record<string, Record<string, string | Record<string, string>>> | null =
      null;
    try {
      data = nEval(strToParse) as typeof data;
    } catch (err) {
      console.log(err);
    }

    assert(data, 'Format is not taburet or broken\n' + str + '\n');

    const langs = Object.keys(data);
    assert(langs.length === 1, 'Must be only one lang\n' + str + '\n');

    const lang = langs[0]!;
    const _keys = data[lang]!;
    const keys = Object.keys(_keys).map<[string, string | Record<string, string>]>(
      (key) => [key, _keys[key]!],
    );

    return { lang, keys };
  },
};

const paramsReg = (): RegExp => /{(\w+)}/g;

function getParams(name: string): string[] {
  const r = paramsReg();
  const params: string[] = [];
  let res: RegExpExecArray | null;
  while ((res = r.exec(name)) !== null) {
    params.push(res[1]!);
  }
  return params;
}

const keyFormat: KeyFormat = {
  parse(name: string, value: string | Record<string, string>): ParsedKeyValue {
    if (typeof value === 'object') {
      const plural = Object.keys(value).reduce<Record<string, ParsedKeyValue>>(
        (acc, form) => {
          const formValue = value[form]!;
          const _params = getParams(formValue);
          acc[form] = {
            name,
            value: formValue,
            params: _params.length >= 1 ? _params : null,
          };
          return acc;
        },
        {},
      );
      return { name, value: plural, params: null };
    }

    const params = getParams(value);
    return {
      name,
      value,
      params: params.length >= 1 ? params : null,
    };
  },
};

export const taburet: KeysetFormat = {
  LangKeys: langKeysFormat,
  Key: keyFormat,
};
