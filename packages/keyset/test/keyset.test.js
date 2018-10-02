'use strict';

const fs = require('fs');

const { stripIndent } = require('common-tags');
const expect = require('chai').expect;
const mock = require('mock-fs');

const { Keyset, Key, ParamedKey, PluralKey, LangKeys } = require('..');

describe('Keyset', () => {
    it('should create Keyset', () => {
        const keyset = new Keyset('Time', 'src/features/Time/Time.i18n');
        expect(keyset.name).to.be.eql('Time');
        expect(keyset.path).to.be.eql('src/features/Time/Time.i18n');
    });

    describe('load', async () => {
        beforeEach(() => {
            mock({
                'src/features/Time/Time.i18n': {
                    'ru.js': stripIndent(`
                        export const ru = {
                            'Time difference': 'Разница "во" времени',
                            '{count} minute': {
                                'one': '{count} минута',
                                'some': '{count} минуты',
                                'many': '{count} минут',
                                'none': 'нет минут',
                            },
                        };
                    `),
                    'en.js': stripIndent(`
                        export const en = {
                            'Time difference': 'Time difference',
                            '{count} minute': {
                                'one': '{count} minute',
                                'some': '{count} minutes',
                                'many': '{count} minutes',
                                'none': 'none',
                            },
                        };
                    `)
                }
            });
        });

        afterEach(() => {
            mock.restore();
        });


        it('should load keys', async () => {
            const keyset = new Keyset('Time', 'src/features/Time/Time.i18n');
            await keyset.load();

            expect(keyset.langs).to.be.eql(['en', 'ru']);

            const langKeys = keyset.getLangKeysForLang('ru')
            expect(langKeys.keys.length).to.be.eql(2)

            const keys = keyset.getKeysForLang('en');
            expect(keys[0].value).to.be.eql('Time difference');
            expect(keys[1].name).to.be.eql('{count} minute');
        });
    });

    describe('save', () => {
        beforeEach(() => {
            mock({
                'src/features/Time': { }
            });
        });

        afterEach(() => {
            mock.restore();
        });

        it('should save keys', async () => {
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

            const keyset = new Keyset('Time');
            keyset.path = 'src/features/Time/Time.i18n';
            keyset.addKeysForLang('ru', langKeys);

            await keyset.save();

            const str = fs.readFileSync('src/features/Time/Time.i18n/ru.js', 'utf-8');
            expect(langKeys.stringify('taburet')).to.be.eql(str);
        });

        it('should save keys with different extension', async () => {
            const ruLangKeys = new LangKeys('ru', [
                new ParamedKey('Time in {city}', 'Точное время {city}', ['city']),
            ]);
            const enLangKeys = new LangKeys('en', [
                new ParamedKey('Time in {city}', 'Time in {city}', ['city']),
            ]);

            const keyset = new Keyset('Time');
            keyset.path = 'src/features/Time/Time.i18n';
            keyset.addKeysForLang('ru', ruLangKeys);
            keyset.addKeysForLang('en', enLangKeys);
            keyset.langsKeysExt = '.ts';

            await keyset.save();

            const ruStr = fs.readFileSync('src/features/Time/Time.i18n/ru.ts', 'utf-8');
            expect(ruLangKeys.stringify('taburet')).to.be.eql(ruStr);

            const enStr = fs.readFileSync('src/features/Time/Time.i18n/en.ts', 'utf-8');
            expect(enLangKeys.stringify('taburet')).to.be.eql(enStr);
        });

        it('should generate rexport if needed', async () => {
            const ruLangKeys = new LangKeys('ru', [
                new ParamedKey('Time in {city}', 'Точное время {city}', ['city']),
            ]);
            const enLangKeys = new LangKeys('en', [
                new ParamedKey('Time in {city}', 'Time in {city}', ['city']),
            ]);

            const keyset = new Keyset('Time');
            keyset.path = 'src/features/Time/Time.i18n';
            keyset.addKeysForLang('ru', ruLangKeys);
            keyset.addKeysForLang('en', enLangKeys);
            keyset.langsKeysExt = '.ts';

            await keyset.save();

            const reExport = fs.readFileSync('src/features/Time/Time.i18n/index.ts', 'utf-8');
            expect(reExport).to.be.eql(stripIndent(`
                export * from './ru';
                export * from './en';
            `) + '\n');
        });
    });
});
