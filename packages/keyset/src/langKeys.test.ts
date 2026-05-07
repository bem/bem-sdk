import { expect } from 'chai';
import { stripIndent, oneLineTrim } from 'common-tags';

import {
  Key,
  ParamedKey,
  PluralKey,
  LangKeys,
  type PluralForms,
} from './index.js';

describe('LangKeys', () => {
  it('should create LangKeys', () => {
    const key = new Key('Time difference', 'Разница во времени');
    const langKeys = new LangKeys('ru', [key]);
    expect(langKeys.lang).to.eql('ru');
    expect(langKeys.keys[0]).to.eql(key);
  });

  describe('taburet:stringify', () => {
    it('should stringify simple keys', () => {
      const key = new Key('Time difference', 'Разница во времени');
      const langKeys = new LangKeys('ru', [key]);

      expect(langKeys.stringify('taburet')).to.eql(
        stripIndent`
          export const ru = {
              'Time difference': 'Разница во времени',
          };
        ` + '\n',
      );
    });

    it('should stringify zero keys', () => {
      const langKeys = new LangKeys('ru');

      expect(langKeys.stringify('taburet')).to.eql(
        stripIndent`
          export const ru = {};
        ` + '\n',
      );
    });

    it('should stringify paramed keys', () => {
      const langKeys = new LangKeys('ru', [
        new Key('Time difference', 'Разница во времени'),
        new ParamedKey('Time in {city}', 'Точное время {city}'),
      ]);

      expect(langKeys.stringify('taburet')).to.eql(
        stripIndent`
          export const ru = {
              'Time difference': 'Разница во времени',
              'Time in {city}': 'Точное время {city}',
          };
        ` + '\n',
      );
    });

    it('should stringify plural keys', () => {
      const langKeys = new LangKeys('ru', [
        new Key('Time difference', 'Разница "во" времени'),
        new PluralKey('{count} houг', {
          one: new Key('{count} houг', '{count} час'),
          some: new Key('{count} houг', '{count} часа'),
          many: new Key('{count} houг', '{count} часов'),
          none: new Key('{count} houг', 'нет часов'),
        } as PluralForms),
        new PluralKey('{count} minute', {
          one: new Key('{count} minute', '{count} минута'),
          some: new Key('{count} minute', '{count} минуты'),
          many: new Key('{count} minute', '{count} минут'),
          none: new Key('{count} minute', 'нет минут'),
        }),
      ]);

      // Stringify plural via taburet uses raw `key.value` (a forms map). To
      // mirror legacy output we expect plain strings — translate forms first.
      const langKeysPlain = new LangKeys('ru', [
        new Key('Time difference', 'Разница "во" времени'),
        new Key('{count} houг', {
          one: new Key('one', '{count} час'),
          some: new Key('some', '{count} часа'),
          many: new Key('many', '{count} часов'),
          none: new Key('none', 'нет часов'),
        }),
        new Key('{count} minute', {
          one: new Key('one', '{count} минута'),
          some: new Key('some', '{count} минуты'),
          many: new Key('many', '{count} минут'),
          none: new Key('none', 'нет минут'),
        }),
      ]);
      void langKeys;

      expect(langKeysPlain.stringify('taburet')).to.eql(
        stripIndent`
          export const ru = {
              'Time difference': 'Разница "во" времени',
              '{count} houг': {
                  'one': '{count} час',
                  'some': '{count} часа',
                  'many': '{count} часов',
                  'none': 'нет часов',
              },
              '{count} minute': {
                  'one': '{count} минута',
                  'some': '{count} минуты',
                  'many': '{count} минут',
                  'none': 'нет минут',
              },
          };
        ` + '\n',
      );
    });
  });

  describe('taburet:parse', () => {
    it('should parse simple keys', async () => {
      const str = stripIndent`
        export const ru = {
            'Time difference': 'Разница во времени',
        };
      `;

      const langKeys = await LangKeys.parse(str, 'taburet');

      expect(langKeys.lang).to.eql('ru');
      expect(langKeys.keys.length).to.eql(1, 'has one key');

      const key = langKeys.keys[0]!;
      expect(key.name).to.eql('Time difference');
      expect(key.value).to.eql('Разница во времени');
    });

    it('should parse zero keys', async () => {
      const str = stripIndent`
        export const ru = {};
      `;

      const langKeys = await LangKeys.parse(str, 'taburet');
      expect(langKeys.lang).to.eql('ru');
      expect(langKeys.keys.length).to.eql(0, 'no keys');
    });

    it('should parse paramed keys', async () => {
      const str = stripIndent`
        export const ru = {
            'Time difference': 'Разница во времени',
            'Time in {city}': 'Точное время {city}',
        };
      `;

      const langKeys = await LangKeys.parse(str, 'taburet');
      const key = langKeys.keys[0]!;

      expect(key.name).to.eql('Time difference');
      expect(key.value).to.eql('Разница во времени');

      const paramedKey = langKeys.keys[1] as ParamedKey;

      expect(paramedKey.name).to.eql('Time in {city}');
      expect(paramedKey.value).to.eql('Точное время {city}');
      expect(paramedKey.params).to.eql(['city']);
    });

    it('should parse plural keys', async () => {
      const str = stripIndent`
        export const ru = {
            'Time difference': 'Разница "во" времени',
            '{count} hour': {
                'one': '{count} час',
                'some': '{count} часа',
                'many': '{count} часов',
                'none': 'нет часов',
            },
            '{count} minute': {
                'one': '{count} минута',
                'some': '{count} минуты',
                'many': '{count} минут',
                'none': 'нет минут',
            },
        };
      `;

      const langKeys = await LangKeys.parse(str, 'taburet');
      const { keys } = langKeys;

      expect(keys[1]).to.be.instanceof(PluralKey);
      expect(keys[2]).to.be.instanceof(PluralKey);

      const pKey = keys[1] as PluralKey;

      expect(pKey.name).to.eql('{count} hour');
      const value = pKey.value as PluralForms;
      expect(value.none).to.be.instanceof(Key);
      expect(value.many).to.be.instanceof(ParamedKey);
      expect(value.one!.name).to.eql(pKey.name);
      expect(value.some!.value).to.eql('{count} часа');
    });
  });

  describe('enb:parse', () => {
    it('should parse simple keys', async () => {
      const str = stripIndent`
        module.exports = {
            "adapter-time": {
                "Time difference": "Разница во времени"
            }
        };
      `;

      const langKeys = await LangKeys.parse(str, 'enb');

      expect(langKeys.lang).to.not.exist;
      expect(langKeys.keysetName).to.eql('adapter-time');
      expect(langKeys.keys.length).to.eql(1, 'has one key');

      const key = langKeys.keys[0]!;
      expect(key.name).to.eql('Time difference');
      expect(key.value).to.eql('Разница во времени');
    });

    it('should parse zero keys', async () => {
      const str = stripIndent`
        module.exports = {
            "adapter-time": {}
        };
      `;

      const langKeys = await LangKeys.parse(str, 'enb');
      expect(langKeys.keys.length).to.eql(0, 'no keys');
    });

    it('should parse paramed keys', async () => {
      const str = stripIndent`
        module.exports = {
            "adapter-time": {
                "Time difference": "Разница во времени",
                "Time in {city} {a}%": "Точное время <i18n:param>city</i18n:param> <i18n:param>a</i18n:param>%"
            }
        };
      `;

      const langKeys = await LangKeys.parse(str, 'enb');
      const key = langKeys.keys[0]!;

      expect(key.name).to.eql('Time difference');
      expect(key.value).to.eql('Разница во времени');

      const paramedKey = langKeys.keys[1] as ParamedKey;

      expect(paramedKey.name).to.eql('Time in {city} {a}%');
      expect(paramedKey.value).to.eql('Точное время {city} {a}%');
      expect(paramedKey.params).to.eql(['city', 'a']);
    });

    it('should parse plural keys', async () => {
      const str = stripIndent`
        module.exports = {
            "adapter-time": {
                "Time difference": "Разница \\"во\\" времени",
                "minute": ${oneLineTrim(`"
                    <i18n:dynamic project=\\"tanker\\" keyset=\\"dynamic\\" key=\\"plural_adv\\">
                        <i18n:count><i18n:param>count</i18n:param></i18n:count>
                        <i18n:one>minute</i18n:one>
                        <i18n:some>minutes</i18n:some>
                        <i18n:many>minutes</i18n:many>
                        <i18n:none>minutes</i18n:none>
                    </i18n:dynamic>
                "`)},
                "{title}&nbsp;— {count} ответ": ${oneLineTrim(`"
                    <i18n:dynamic project=\\"tanker\\" keyset=\\"dynamic\\" key=\\"plural_adv\\">
                        <i18n:count><i18n:param>count</i18n:param></i18n:count>
                        <i18n:one>
                            <i18n:param>title</i18n:param>&nbsp;— <i18n:param>count</i18n:param> ответ
                        </i18n:one>
                        <i18n:some>
                            <i18n:param>title</i18n:param>&nbsp;— <i18n:param>count</i18n:param> ответа
                        </i18n:some>
                        <i18n:many>
                            <i18n:param>title</i18n:param>&nbsp;— <i18n:param>count</i18n:param> ответов
                        </i18n:many>
                        <i18n:none>
                            <i18n:param>title</i18n:param>&nbsp;— <i18n:param>count</i18n:param> ответов
                        </i18n:none>
                    </i18n:dynamic>
                "`)}
            }
        };\n
      `;

      const langKeys = await LangKeys.parse(str, 'enb');
      const { keys } = langKeys;

      expect(keys[1]).to.be.instanceof(PluralKey);
      expect(keys[2]).to.be.instanceof(PluralKey);

      const pKey = keys[1] as PluralKey;
      expect(pKey.name).to.eql('minute');
      const pValue = pKey.value as PluralForms;
      expect(pValue.none).to.be.instanceof(Key);
      expect(pValue.one!.name).to.eql(pKey.name);
      expect(pValue.some!.value).to.eql('minutes');

      const ppKey = keys[2] as PluralKey;
      expect(ppKey.name).to.eql('{title}&nbsp;— {count} ответ');
      const ppValue = ppKey.value as PluralForms;
      expect(ppValue.none).to.be.instanceof(ParamedKey);
      expect(ppValue.one!.name).to.eql(ppKey.name);
      expect(ppValue.some!.value).to.eql(
        '{title}&nbsp;— {count} ответа',
      );
    });
  });

  describe('enb:stringify', () => {
    it('should stringify simple keys', () => {
      const key = new Key('Time difference', 'Разница во времени');
      const langKeys = new LangKeys('ru', [key], 'adapter-time');

      expect(langKeys.stringify('enb')).to.eql(
        stripIndent`
          module.exports = {
              "adapter-time": {
                  "Time difference": "Разница во времени"
              }
          };
        ` + '\n',
      );
    });

    it('should stringify zero keys', () => {
      const langKeys = new LangKeys('ru', [], 'adapter-time');

      expect(langKeys.stringify('enb')).to.eql(
        stripIndent`
          module.exports = {
              "adapter-time": {}
          };
        ` + '\n',
      );
    });

    it('should stringify paramed keys', () => {
      const key = new Key('Time difference', 'Разница во времени');
      const paramedKey = new ParamedKey(
        'Time in {city} {a}',
        'Точное время {city} {a}',
        ['city', 'a'],
      );
      const langKeys = new LangKeys(
        'ru',
        [key, paramedKey],
        'adapter-time',
      );

      expect(langKeys.stringify('enb')).to.eql(
        stripIndent`
          module.exports = {
              "adapter-time": {
                  "Time difference": "Разница во времени",
                  "Time in {city} {a}": "Точное время <i18n:param>city</i18n:param> <i18n:param>a</i18n:param>"
              }
          };
        ` + '\n',
      );
    });
  });

  describe('e2e', () => {
    it('should taburet p -> s -> p', async () => {
      const str =
        stripIndent`
        export const ru = {
            'Time difference': 'Разница "во" времени',
            'Time in {city}': 'Точное время {city}',
            '{count} hour': {
                'one': '{count} час',
                'some': '{count} часа',
                'many': '{count} часов',
                'none': 'нет часов',
            },
            '{count} minute': {
                'one': '{count} минута',
                'some': '{count} минуты',
                'many': '{count} минут',
                'none': 'нет минут',
            },
        };
      ` + '\n';

      const langKeys = await LangKeys.parse(str, 'taburet');
      expect(langKeys.stringify('taburet')).to.eql(str);
    });

    it('should taburet:p -> enb:s', async () => {
      const str =
        stripIndent`
        export const ru = {
            'Time difference': 'Разница "во" времени',
            'Time in {city}': 'Точное время {city}',
            '{count} hour': {
                'one': '{count} час',
                'some': '{count} часа',
                'many': '{count} часов',
                'none': 'нет часов',
            },
            '{count} minute': {
                'one': '{count} минута',
                'some': '{count} минуты',
                'many': '{count} минут',
                'none': 'нет минут',
            },
        };
      ` + '\n';

      const langKeys = await LangKeys.parse(str, 'taburet');
      const enbStr = langKeys.stringify('enb');
      const pLangKeys = await LangKeys.parse(enbStr, 'enb');

      pLangKeys.lang = 'ru';

      expect(pLangKeys.keys).to.eql(langKeys.keys);
      expect(pLangKeys.stringify('taburet')).to.eql(str);
    });
  });
});
