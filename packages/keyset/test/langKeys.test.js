'use strict';

const { stripIndent, oneLineTrim } = require('common-tags');
const expect = require('chai').expect;

const { Key, ParamedKey, PluralKey, LangKeys } = require('..');

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

            expect(langKeys.stringify('taburet')).to.eql(stripIndent`
                export const ru = {
                    'Time difference': 'Разница во времени',
                };
            ` + '\n');
        });

        it('should stringify zero keys', () => {
            const langKeys = new LangKeys('ru');

            expect(langKeys.stringify('taburet')).to.eql(stripIndent`
                export const ru = {};
            ` + '\n');
        });

        it('should stringify paramed keys', () => {
            const langKeys = new LangKeys('ru', [
                new Key('Time difference', 'Разница во времени'),
                new ParamedKey('Time in {city}', 'Точное время {city}') 
            ]);

            expect(langKeys.stringify('taburet')).to.eql(stripIndent`
                export const ru = {
                    'Time difference': 'Разница во времени',
                    'Time in {city}': 'Точное время {city}',
                };
            ` + '\n');
        });

        it('should stringify plural keys', () => {
            const langKeys = new LangKeys('ru', [
                new Key('Time difference', 'Разница "во" времени'),
                new PluralKey('{count} houг', {
                    'one': '{count} час',
                    'some': '{count} часа',
                    'many': '{count} часов',
                    'none': 'нет часов'
                }),
                new PluralKey('{count} minute', {
                    one: '{count} минута',
                    some: '{count} минуты',
                    many: '{count} минут',
                    none: 'нет минут'
                })
            ]);

            expect(langKeys.stringify('taburet')).to.eql(stripIndent`
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
            ` + '\n');
        });
    });

    describe('taburet:parse', () => {
        it('should parse simple keys', async () => {
            const str = stripIndent`
                export const ru = {
                    'Time difference': 'Разница во времени',
                };
            `;

            const langKeys = await LangKeys.parse(str, 'taburet')

            expect(langKeys.lang).to.eql('ru');
            expect(langKeys.keys.length).to.eql(1, 'has one key');

            const key = langKeys.keys[0];

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
            const key = langKeys.keys[0];

            expect(key.name).to.eql('Time difference');
            expect(key.value).to.eql('Разница во времени');

            const paramedKey = langKeys.keys[1];

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

            const pKey = keys[1];

            expect(pKey.name).to.eql('{count} hour');
            expect(pKey.value.none).to.be.instanceof(Key);
            expect(pKey.value.many).to.be.instanceof(ParamedKey);
            expect(pKey.value.one.name).to.be.eql(pKey.name);
            expect(pKey.value.some.value).to.be.eql('{count} часа');
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

            const langKeys = await LangKeys.parse(str, 'enb')

            expect(langKeys.lang).not.to.exist;
            expect(langKeys.keysetName).to.eql('adapter-time');
            expect(langKeys.keys.length).to.eql(1, 'has one key');

            const key = langKeys.keys[0];

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
            const key = langKeys.keys[0];

            expect(key.name).to.eql('Time difference');
            expect(key.value).to.eql('Разница во времени');

            const paramedKey = langKeys.keys[1];

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

            const pKey = keys[1];

            expect(pKey.name).to.eql('minute');
            expect(pKey.value.none).to.be.instanceof(Key);
            expect(pKey.value.one.name).to.be.eql(pKey.name);
            expect(pKey.value.some.value).to.be.eql('minutes');

            const ppKey = keys[2];

            expect(ppKey.name).to.eql('{title}&nbsp;— {count} ответ');
            expect(ppKey.value.none).to.be.instanceof(ParamedKey);
            expect(ppKey.value.one.name).to.be.eql(ppKey.name);
            expect(ppKey.value.some.value).to.be.eql('{title}&nbsp;— {count} ответа');
        });
    });

    describe('enb:stringify', () => {
        it('should stringify simple keys', () => {
            const key = new Key('Time difference', 'Разница во времени');
            const langKeys = new LangKeys('ru', [key], 'adapter-time');

            expect(langKeys.stringify('enb')).to.eql(stripIndent`
                module.exports = {
                    "adapter-time": {
                        "Time difference": "Разница во времени"
                    }
                };
            ` + '\n');
        });

        it('should stringify zero keys', () => {
            const langKeys = new LangKeys('ru', [], 'adapter-time');

            expect(langKeys.stringify('enb')).to.eql(stripIndent`
                module.exports = {
                    "adapter-time": {}
                };
            ` + '\n');
        });

        it('should stringify paramed keys', () => {
            const key = new Key('Time difference', 'Разница во времени');
            const paramedKey = new ParamedKey('Time in {city} {a}', 'Точное время {city} {a}', ['city', 'a']);
            const langKeys = new LangKeys('ru', [key, paramedKey], 'adapter-time');

            expect(langKeys.stringify('enb')).to.eql(stripIndent`
                module.exports = {
                    "adapter-time": {
                        "Time difference": "Разница во времени",
                        "Time in {city} {a}": "Точное время <i18n:param>city</i18n:param> <i18n:param>a</i18n:param>"
                    }
                };
            ` + '\n');
        });

        it('should stringify plural keys', () => {
            const key = new Key('Time difference', 'Разница "во" времени');
            const pKey = new PluralKey('minute', {
                one: new Key('minute', 'minute'),
                some: new Key('minute', 'minutes'),
                many: new Key('minute', 'minutes'),
                none: new Key('minute', 'minutes')
            });
            const ppKey = new PluralKey('{title}&nbsp;— {count} ответ', {
                one: new ParamedKey('{title}&nbsp;— {count} ответ', '{title}&nbsp;— {count} ответ'),
                some: new ParamedKey('{title}&nbsp;— {count} ответ', '{title}&nbsp;— {count} ответа'),
                many: new ParamedKey('{title}&nbsp;— {count} ответ', '{title}&nbsp;— {count} ответов'),
                none: new ParamedKey('{title}&nbsp;— {count} ответ', '{title}&nbsp;— {count} ответов')
            });
            const langKeys = new LangKeys('ru', [key, pKey, ppKey], 'adapter-time');

            expect(langKeys.stringify('enb')).to.eql(stripIndent`
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
                };
            ` + '\n');
        });
    });

    describe('e2e', () => {
        it('should taburet p -> s -> p', async () => {
            const str = stripIndent`
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
            expect(langKeys.stringify('taburet')).to.be.eql(str);
        });

        it('should taburet s -> p -> s', async () => {
            const langKeys = new LangKeys('ru', [
                new Key('Time difference', 'Разница "во" времени'),
                new ParamedKey('Time in {city}', 'Точное время {city}', ['city']),
                new PluralKey('{count} hour', {
                    'one': new ParamedKey('{count} hour', '{count} час', ['count']),
                    'some': new ParamedKey('{count} hour', '{count} часа', ['count']),
                    'many': new ParamedKey('{count} hour', '{count} часов', ['count']),
                    'none': new Key('{count} hour', 'нет часов')
                }),
                new PluralKey('{count} minute', {
                    one: new ParamedKey('{count} minute', '{count} минута', ['count']),
                    some: new ParamedKey('{count} minute', '{count} минуты', ['count']),
                    many: new ParamedKey('{count} minute', '{count} минут', ['count']),
                    none: new Key('{count} minute', 'нет минут')
                })
            ]);

            const str = LangKeys.stringify(langKeys, 'taburet');
            const pLangKeys = await LangKeys.parse(str, 'taburet');

            expect(pLangKeys.lang).to.be.eql(langKeys.lang);
            expect(pLangKeys.keys).to.be.eql(langKeys.keys);
            expect(pLangKeys.stringify('taburet')).to.be.eql(str);
        });

        it('should enb p -> s -> p', async () => {
            const str = stripIndent`
                module.exports = {
                    "Time": {
                        "Time difference": "Разница \\"во\\" времени",
                        "Time in {city}": "Точное время <i18n:param>city</i18n:param>",
                        "{count} hour": ${oneLineTrim(`"
                            <i18n:dynamic project=\\"tanker\\" keyset=\\"dynamic\\" key=\\"plural_adv\\">
                                <i18n:count><i18n:param>count</i18n:param></i18n:count>
                                <i18n:one>
                                    <i18n:param>count</i18n:param> час
                                </i18n:one>
                                <i18n:some>
                                    <i18n:param>count</i18n:param> часа
                                </i18n:some>
                                <i18n:many>
                                    <i18n:param>count</i18n:param> часов
                                </i18n:many>
                                <i18n:none>
                                    нет часов
                                </i18n:none>
                            </i18n:dynamic>
                        "`)},
                        "{count} minute": ${oneLineTrim(`"
                            <i18n:dynamic project=\\"tanker\\" keyset=\\"dynamic\\" key=\\"plural_adv\\">
                                <i18n:count><i18n:param>count</i18n:param></i18n:count>
                                <i18n:one>
                                    <i18n:param>count</i18n:param> минута
                                </i18n:one>
                                <i18n:some>
                                    <i18n:param>count</i18n:param> минуты
                                </i18n:some>
                                <i18n:many>
                                    <i18n:param>count</i18n:param> минут
                                </i18n:many>
                                <i18n:none>
                                    нет минут
                                </i18n:none>
                            </i18n:dynamic>
                        "`)}
                    }
                };
            ` + '\n';

            const langKeys = await LangKeys.parse(str, 'enb');
            expect(langKeys.stringify('enb')).to.be.eql(str);
        });

        it('should enb s -> p -> s', async () => {
            const langKeys = new LangKeys('ru', [
                new Key('Time difference', 'Разница "во" времени'),
                new ParamedKey('Time in {city}', 'Точное время {city}', ['city']),
                new PluralKey('{count} hour', {
                    'one': new ParamedKey('{count} hour', '{count} час', ['count']),
                    'some': new ParamedKey('{count} hour', '{count} часа', ['count']),
                    'many': new ParamedKey('{count} hour', '{count} часов', ['count']),
                    'none': new Key('{count} hour', 'нет часов')
                }),
                new PluralKey('{count} minute', {
                    one: new ParamedKey('{count} minute', '{count} минута', ['count']),
                    some: new ParamedKey('{count} minute', '{count} минуты', ['count']),
                    many: new ParamedKey('{count} minute', '{count} минут', ['count']),
                    none: new Key('{count} minute', 'нет минут')
                })
            ], 'Time');

            const str = LangKeys.stringify(langKeys, 'enb');
            const pLangKeys = await LangKeys.parse(str, 'enb');

            // enb has no clue about lang on this level
            // expect(pLangKeys.lang).to.be.eql(langKeys.lang);
            expect(pLangKeys.keysetName).to.be.eql(langKeys.keysetName);
            expect(pLangKeys.keys).to.be.eql(langKeys.keys);
            expect(pLangKeys.stringify('enb')).to.be.eql(str);
        });

        it('should taburet:p -> enb:s', async () => {
            const str = stripIndent`
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
            const enbStr = langKeys.stringify('enb')
            const pLangKeys = await LangKeys.parse(enbStr, 'enb');

            pLangKeys.lang = 'ru';

            expect(pLangKeys.keys).to.be.eql(langKeys.keys);
            expect(pLangKeys.stringify('taburet')).to.be.eql(str);
        });

        it('should enb:p -> taburet:s', async () => {
            const str = stripIndent`
                module.exports = {
                    "Time": {
                        "Time difference": "Разница \\"во\\" времени",
                        "Time in {city}": "Точное время <i18n:param>city</i18n:param>",
                        "{count} hour": ${oneLineTrim(`"
                            <i18n:dynamic project=\\"tanker\\" keyset=\\"dynamic\\" key=\\"plural_adv\\">
                                <i18n:count><i18n:param>count</i18n:param></i18n:count>
                                <i18n:one>
                                    <i18n:param>count</i18n:param> час
                                </i18n:one>
                                <i18n:some>
                                    <i18n:param>count</i18n:param> часа
                                </i18n:some>
                                <i18n:many>
                                    <i18n:param>count</i18n:param> часов
                                </i18n:many>
                                <i18n:none>
                                    нет часов
                                </i18n:none>
                            </i18n:dynamic>
                        "`)},
                        "{count} minute": ${oneLineTrim(`"
                            <i18n:dynamic project=\\"tanker\\" keyset=\\"dynamic\\" key=\\"plural_adv\\">
                                <i18n:count><i18n:param>count</i18n:param></i18n:count>
                                <i18n:one>
                                    <i18n:param>count</i18n:param> минута
                                </i18n:one>
                                <i18n:some>
                                    <i18n:param>count</i18n:param> минуты
                                </i18n:some>
                                <i18n:many>
                                    <i18n:param>count</i18n:param> минут
                                </i18n:many>
                                <i18n:none>
                                    нет минут
                                </i18n:none>
                            </i18n:dynamic>
                        "`)}
                    }
                };
            ` + '\n';

            const langKeys = await LangKeys.parse(str, 'enb');
            const taburetStr = langKeys.stringify('taburet')
            const pLangKeys = await LangKeys.parse(taburetStr, 'taburet');

            pLangKeys.keysetName = 'Time';

            expect(pLangKeys.keys).to.be.eql(langKeys.keys);
            expect(pLangKeys.stringify('enb')).to.be.eql(str);
        });
    });
});
