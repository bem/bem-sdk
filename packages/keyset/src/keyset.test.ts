import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { expect } from 'chai';
import { stripIndent } from 'common-tags';

import {
  Key,
  Keyset,
  LangKeys,
  ParamedKey,
  PluralKey,
} from './index.js';

describe('Keyset', () => {
  it('should create Keyset', () => {
    const keyset = new Keyset('Time', 'src/features/Time/Time.i18n');
    expect(keyset.name).to.eql('Time');
    expect(keyset.path).to.eql('src/features/Time/Time.i18n');
  });

  describe('load', () => {
    let baseDir: string;
    let i18nDir: string;

    beforeEach(async () => {
      baseDir = await mkdtemp(join(tmpdir(), 'bem-sdk-keyset-load-'));
      i18nDir = join(baseDir, 'Time.i18n');
      await mkdir(i18nDir);

      await writeFile(
        join(i18nDir, 'ru.js'),
        stripIndent`
          export const ru = {
              'Time difference': 'Разница "во" времени',
              '{count} minute': {
                  'one': '{count} минута',
                  'some': '{count} минуты',
                  'many': '{count} минут',
                  'none': 'нет минут',
              },
          };
        `,
      );

      await writeFile(
        join(i18nDir, 'en.js'),
        stripIndent`
          export const en = {
              'Time difference': 'Time difference',
              '{count} minute': {
                  'one': '{count} minute',
                  'some': '{count} minutes',
                  'many': '{count} minutes',
                  'none': 'none',
              },
          };
        `,
      );
    });

    afterEach(async () => {
      await rm(baseDir, { recursive: true, force: true });
    });

    it('should load keys', async () => {
      const keyset = new Keyset('Time', i18nDir);
      await keyset.load();

      // Order depends on FS readdir; just check both languages are present.
      expect(keyset.langs.sort()).to.eql(['en', 'ru']);

      const langKeys = keyset.getLangKeysForLang('ru')!;
      expect(langKeys.keys.length).to.eql(2);

      const keys = keyset.getKeysForLang('en') as Key[];
      const tdKey = keys.find((k) => k.name === 'Time difference')!;
      const minuteKey = keys.find((k) => k.name === '{count} minute')!;
      expect(tdKey.value).to.eql('Time difference');
      expect(minuteKey.name).to.eql('{count} minute');
    });
  });

  describe('save', () => {
    let baseDir: string;

    beforeEach(async () => {
      baseDir = await mkdtemp(join(tmpdir(), 'bem-sdk-keyset-save-'));
    });

    afterEach(async () => {
      await rm(baseDir, { recursive: true, force: true });
    });

    it('should save keys', async () => {
      const langKeys = new LangKeys('ru', [
        new Key('Time difference', 'Разница "во" времени'),
        new ParamedKey('Time in {city}', 'Точное время {city}', ['city']),
        new PluralKey('{count} hour', {
          one: new ParamedKey('{count} hour', '{count} час', ['count']),
          some: new ParamedKey('{count} hour', '{count} часа', ['count']),
          many: new ParamedKey('{count} hour', '{count} часов', ['count']),
          none: new Key('{count} hour', 'нет часов'),
        }),
        new PluralKey('{count} minute', {
          one: new ParamedKey('{count} minute', '{count} минута', ['count']),
          some: new ParamedKey('{count} minute', '{count} минуты', ['count']),
          many: new ParamedKey('{count} minute', '{count} минут', ['count']),
          none: new Key('{count} minute', 'нет минут'),
        }),
      ]);

      const keyset = new Keyset('Time');
      keyset.path = join(baseDir, 'Time.i18n');
      keyset.addKeysForLang('ru', langKeys);

      await keyset.save();

      const str = await readFile(
        join(baseDir, 'Time.i18n', 'ru' + keyset.langsKeysExt),
        'utf-8',
      );
      expect(langKeys.stringify('taburet')).to.eql(str);
    });

    it('should save keys with custom extension', async () => {
      const ruLangKeys = new LangKeys('ru', [
        new ParamedKey('Time in {city}', 'Точное время {city}', ['city']),
      ]);
      const enLangKeys = new LangKeys('en', [
        new ParamedKey('Time in {city}', 'Time in {city}', ['city']),
      ]);

      const keyset = new Keyset('Time');
      keyset.path = join(baseDir, 'Time.i18n');
      keyset.addKeysForLang('ru', ruLangKeys);
      keyset.addKeysForLang('en', enLangKeys);
      keyset.langsKeysExt = '.ts';

      await keyset.save();

      const ruStr = await readFile(
        join(baseDir, 'Time.i18n', 'ru.ts'),
        'utf-8',
      );
      expect(ruLangKeys.stringify('taburet')).to.eql(ruStr);

      const enStr = await readFile(
        join(baseDir, 'Time.i18n', 'en.ts'),
        'utf-8',
      );
      expect(enLangKeys.stringify('taburet')).to.eql(enStr);
    });

    it('should generate re-export index when needed', async () => {
      const ruLangKeys = new LangKeys('ru', [
        new ParamedKey('Time in {city}', 'Точное время {city}', ['city']),
      ]);
      const enLangKeys = new LangKeys('en', [
        new ParamedKey('Time in {city}', 'Time in {city}', ['city']),
      ]);

      const keyset = new Keyset('Time');
      keyset.path = join(baseDir, 'Time.i18n');
      keyset.addKeysForLang('ru', ruLangKeys);
      keyset.addKeysForLang('en', enLangKeys);
      keyset.langsKeysExt = '.ts';

      await keyset.save();

      const reExport = await readFile(
        join(baseDir, 'Time.i18n', 'index.ts'),
        'utf-8',
      );
      expect(reExport).to.eql(
        stripIndent`
          export * from './ru';
          export * from './en';
        ` + '\n',
      );
    });
  });

});
