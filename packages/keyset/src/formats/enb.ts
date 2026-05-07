import assert from 'node:assert';

import nEval from 'node-eval';

import type { Key as KeyClass } from '../key.js';
import type { LangKeys } from '../langKeys.js';
import { parseEnbXml, type ParsedXmlEntry } from './enb-parse-xml.js';
import type {
  KeyFormat,
  KeysetFormat,
  LangKeysFormat,
  ParsedKeyValue,
  ParsedLangKeys,
} from './types.js';

interface EnbKey {
  value: string | Record<string, KeyClass>;
  params?: string[] | null;
}

const keyFormat: KeyFormat & {
  stringify(key: EnbKey): string;
} = {
  stringify(key: EnbKey): string {
    if (typeof key.value === 'object') {
      const value = key.value;
      return Object.keys(value)
        .reduce<string[]>(
          (acc, form) => {
            const k = value[form]!;
            acc.push(
              `<i18n:${form}>${keyFormat.stringify(k as unknown as EnbKey)}</i18n:${form}>`,
            );
            return acc;
          },
          [
            '<i18n:dynamic project="tanker" keyset="dynamic" key="plural_adv">',
            '<i18n:count><i18n:param>count</i18n:param></i18n:count>',
          ],
        )
        .concat('</i18n:dynamic>')
        .join('');
    }
    if (key.params) {
      return key.value.replace(
        /{(\w+)}/g,
        (_, param) => `<i18n:param>${param}</i18n:param>`,
      );
    }
    return key.value;
  },

  async parse(
    name: string,
    value: string | Record<string, string>,
  ): Promise<ParsedKeyValue> {
    const _arr = await parseEnbXml(String(value));

    const normalize = (arr: ParsedXmlEntry[]): ParsedKeyValue => {
      const acc: {
        vals: Array<string | Record<string, ParsedKeyValue>>;
        params: string[];
      } = { vals: [], params: [] };
      for (const a of arr) {
        const head = a[0];
        if (typeof head === 'object') {
          const plural = Object.keys(head).reduce<
            Record<string, ParsedKeyValue>
          >((_acc, form) => {
            _acc[form] = normalize(head[form]!);
            return _acc;
          }, {});
          acc.vals.push(plural);
        } else {
          acc.vals.push(head);
        }
        if (a[1]) acc.params.push(a[1]);
      }

      return {
        name,
        value:
          acc.vals.length === 1
            ? acc.vals[0]!
            : acc.vals.map((v) => (typeof v === 'string' ? v : '')).join(''),
        params: acc.params.length >= 1 ? acc.params : null,
      };
    };

    return normalize(_arr);
  },
};

const langKeysFormat: LangKeysFormat = {
  stringify(langKeys: LangKeys): string {
    const keys = langKeys.keys.reduce<Record<string, string>>((acc, key) => {
      acc[key.name] = keyFormat.stringify(key as unknown as EnbKey);
      return acc;
    }, {});

    const obj = { [langKeys.keysetName ?? 'unknown']: keys };
    const keysStr = JSON.stringify(obj, null, 4);
    return `module.exports = ${keysStr};\n`;
  },

  parse(str: string): ParsedLangKeys {
    let data: Record<string, Record<string, string>> | null = null;
    let errMsg = '';
    try {
      data = nEval(str) as typeof data;
    } catch (err) {
      const e = err as Error;
      const s = (e.stack ?? '').split('\n');
      errMsg += e.message + '\n';
      errMsg += (s[1] ?? '') + '\n';
      errMsg += (s[2] ?? '') + '\n';
    }

    assert(data, 'Format is not enb or broken\n' + errMsg);

    const keysetNames = Object.keys(data);
    assert(
      keysetNames.length === 1,
      'Must be only one keysetName\n' + str + '\n',
    );

    const keysetName = keysetNames[0]!;
    const _keys = data[keysetName]!;
    const keys = Object.keys(_keys).map<
      [string, string | Record<string, string>]
    >((key) => [key, _keys[key]!]);

    return { keysetName, keys };
  },
};

export const enb: KeysetFormat = {
  LangKeys: langKeysFormat,
  Key: keyFormat,
};
