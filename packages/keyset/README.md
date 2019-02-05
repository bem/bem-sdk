# Keyset

Tool for representation of BEM i18n keyset.

[![NPM Status][npm-img]][npm]

[npm]:            https://www.npmjs.org/package/@bem/sdk.keyset
[npm-img]:        https://img.shields.io/npm/v/@bem/sdk.keyset.svg

* [Introduction](#introduction)
* [Try keyset](#try-keyset)
* [Quick start](#quick-start)
* [Formats](#formats)
* [API reference](#api-reference)

## Introduction

Keyset representations BEM project's keysets and returns a JavaScript object with information about it.

## Try keyset

An example is available in the [RunKit editor](https://runkit.com/godfreyd/5c3339d802ce8e00124ead3f).

## Quick start

> **Attention.** To use `@bem/sdk.keyset`, you must install [Node.js 8.0+](https://nodejs.org/en/download/).

To run the `@bem/sdk.keyset` package:

1. [Install keyset](#installing-the-bemsdkkeyset-package).
2. [Declaration keyset](#declaration-keyset).

### Installing the `@bem/sdk.keyset` package

To install the `@bem/sdk.keyset` package, run the following command:

```bash
$ npm install --save @bem/sdk.keyset
```

### Declaration keyset

Specify the Keyset name, path, and format for keyset. The `Keyset` class is a constructor for classes that enable format-sensitive keyset formatting.

**Example:**

```js
const { Keyset } = require('@bem/sdk.keyset');
const keyset = new Keyset('Time', 'src/features/Time/Time.i18n');
keyset.name; // => 'Time'
keyset.path; // => 'src/features/Time/Time.i18n'
keyset.format; // => 'taburet' — default format, see Formats
```

[RunKit live editor](https://runkit.com/godfreyd/5c3339d802ce8e00124ead3f).

### Formats

Keyset has two default formats:

| Format | Extension |
|-----------|-------------|
| `enb` | `.js` |
| `taburet` | `.ts` |

If you want to change default extension, override a variable `keyset.langsKeysExt` before saving keyset.

**Example:**

```js
const mockfs = require('mock-fs');
const { Keyset, Key, ParamedKey, PluralKey, LangKeys } = require("@bem/sdk.keyset");

mockfs({
    'src/features/Time/Time.i18n': {}
});

const langKeys = new LangKeys('ru', [
    new Key('Time difference', 'Разница во времени'),
    new PluralKey('{count} minute', {
        one: new ParamedKey('{count} minute', '{count} минута', ['count']),
        some: new ParamedKey('{count} minute', '{count} минуты', ['count']),
        many: new ParamedKey('{count} minute', '{count} минут', ['count']),
        none: new Key('{count} minute', 'нет минут')
    })
]);

const keyset = new Keyset('Time', 'src/features/Time/Time.i18n');
keyset.addKeysForLang('ru', langKeys);
keyset.langsKeysExt = '.ts';
await keyset.save();
keyset;
```

[RunKit live editor](https://runkit.com/godfreyd/5c347b7d8b4b220012693664).

## API reference

### keyset.load()

Loads keyset from project's file system.

```js
async keyset.load();
```

**Example:**

```js
const mockfs = require('mock-fs');
const { stripIndent } = require('common-tags');
const { Keyset } = require("@bem/sdk.keyset");

mockfs({
    'src/features/Time/Time.i18n': {
        'ru.js': stripIndent`
            export const ru = {
                'Time difference': 'Разница во времени',
                '{count} minute': {
                    'one': '{count} минута',
                    'some': '{count} минуты',
                    'many': '{count} минут',
                    'none': 'нет минут',
                },
            };
        `,
        'en.js': stripIndent`
            export const en = {
                'Time difference': 'Time difference',
                '{count} minute': {
                    'one': '{count} minute',
                    'some': '{count} minutes',
                    'many': '{count} minutes',
                    'none': 'none',
                },
            };
        `
    }
});

const keyset = new Keyset('Time', 'src/features/Time/Time.i18n');
await keyset.load();
keyset.langs; // => ['en', 'ru']
```

[RunKit live editor](https://runkit.com/godfreyd/5c334a31bf421300126811b3).

### keyset.getLangKeysForLang(lang)

Gets keys from found keyset.

```js
/**
* Gets keys.
*
* @param {string} lang — the language to traverse
* @return {string[]} — keys
*/
keyset.getLangKeysForLang(lang);
```

**Example:**

```js
const mockfs = require('mock-fs');
const { stripIndent } = require('common-tags');
const { Keyset } = require("@bem/sdk.keyset");

mockfs({
    'src/features/Time/Time.i18n': {
        'ru.js': stripIndent`
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
        'en.js': stripIndent`
            export const en = {
                'Time difference': 'Time difference',
                '{count} minute': {
                    'one': '{count} minute',
                    'some': '{count} minutes',
                    'many': '{count} minutes',
                    'none': 'none',
                },
            };
        `
    }
});

const keyset = new Keyset('Time', 'src/features/Time/Time.i18n');
await keyset.load();
const langKeys = keyset.getLangKeysForLang('ru');

langKeys.keys; // => [Key {name: 'Time difference', value: 'Разница во времени'}, PluralKey { ... }]
```

[RunKit live editor](https://runkit.com/godfreyd/5c345a7b617b3200145cbcfc).

### keyset.addKeysForLang(lang, langKeys)

Adds keys for language. Use with `keyset.save()` method.

```js
/**
* Adds keys.
*
* @param {string} lang — the language to add
* @return {object[]} — keys
*/
keyset.addKeysForLang(lang, langKeys);
```

**Example:**

```js
const mockfs = require('mock-fs');
const { Keyset, Key, ParamedKey, PluralKey, LangKeys } = require("@bem/sdk.keyset");

mockfs({
    'src/features/Time/Time.i18n': {}
});

const ruLangKeys = new LangKeys('ru', [
    new Key('Time difference', 'Разница "во" времени'),
    new PluralKey('{count} minute', {
        one: new ParamedKey('{count} minute', '{count} минута', ['count']),
        some: new ParamedKey('{count} minute', '{count} минуты', ['count']),
        many: new ParamedKey('{count} minute', '{count} минут', ['count']),
        none: new Key('{count} minute', 'нет минут')
    })
]);

const enLangKeys = new LangKeys('en', [
    new Key('Time difference', 'Time difference',),
    new PluralKey('{count} minute', {
        one: new ParamedKey('{count} minute', '{count} minute', ['count']),
        some: new ParamedKey('{count} minute', '{count} minutes', ['count']),
        many: new ParamedKey('{count} minute', '{count} minutes', ['count']),
        none: new Key('{count} minute', 'none')
    })
]);

const keyset = new Keyset('Time', 'src/features/Time/Time.i18n');
keyset.addKeysForLang('ru', ruLangKeys);
keyset.addKeysForLang('en', enLangKeys);
await keyset.save();
keyset.langs; // => ['ru', 'en']
```

[RunKit live editor](https://runkit.com/godfreyd/5c3476cf617b3200145cd6e6).

### keyset.save()

Saves keyset to project's file system. Use with `keyset.addKeysForLang(lang, langKeys)` method.

```js
keyset.save();
```

**Example:**

```js
const mockfs = require('mock-fs');
const { Keyset, Key, ParamedKey, PluralKey, LangKeys } = require("@bem/sdk.keyset");

mockfs({
    'src/features/Time/Time.i18n': {}
});

const langKeys = new LangKeys('ru', [
    new Key('Time difference', 'Разница "во" времени'),
    new PluralKey('{count} minute', {
        one: new ParamedKey('{count} minute', '{count} минута', ['count']),
        some: new ParamedKey('{count} minute', '{count} минуты', ['count']),
        many: new ParamedKey('{count} minute', '{count} минут', ['count']),
        none: new Key('{count} minute', 'нет минут')
    })
]);

const keyset = new Keyset('Time', 'src/features/Time/Time.i18n');
keyset.addKeysForLang('ru', langKeys);
await keyset.save();
keyset.langs; // => ['ru']
```

[RunKit live editor](https://runkit.com/godfreyd/5c347019617b3200145cd068).

### LangKeys.stringify(value, formatName);

Converts a JavaScript object to a special string ready to save on the project's file system.

```js
/**
 * Converts a JavaScript object to a string.
 *
 * @param {Object} value — the value to convert
 * @param {string} formatName  — the name of format
 * @returns {string} — the string to save
 */
LangKeys.stringify(value, formatName);
```

**Example:**

```js
const { Keyset, Key, ParamedKey, PluralKey, LangKeys } = require("@bem/sdk.keyset");
const langKeys = new LangKeys('ru', [
    new Key('Time difference', 'Разница "во" времени'),
    new PluralKey('{count} minute', {
        one: new ParamedKey('{count} minute', '{count} минута', ['count']),
        some: new ParamedKey('{count} minute', '{count} минуты', ['count']),
        many: new ParamedKey('{count} minute', '{count} минут', ['count']),
        none: new Key('{count} minute', 'нет минут')
    })
]);
langKeys.stringify('taburet');
// => "export const ru = {\n'Time difference': 'Разница "во" времени',\n'{count} minute': {\n'one': '{count} минута',\n'some': '{count} минуты',\n'many': '{count} минут',\n'none': 'нет минут',\n},\n};"
```

[RunKit live editor](https://runkit.com/godfreyd/5c348b6bee503400124b0523).

### LangKeys.parse(str, formatName)

Parses a string, constructing the JavaScript object described by the string.

```js
/**
 * Parses a string to JavaScript object.
 *
 * @param {Object} str — the string to parse
 * @param {string} formatName  — the name of format
 * @returns {string} — the JavaScript object
 */
await LangKeys.parse(str, formatName);
```

**Example:**

```js
const { Keyset, Key, ParamedKey, PluralKey, LangKeys } = require("@bem/sdk.keyset");
const { stripIndent } = require('common-tags');
const str = stripIndent`
    export const ru = {
        'Time difference': 'Разница "во" времени',
        '{count} minute': {
            'one': '{count} минута',
            'some': '{count} минуты',
            'many': '{count} минут',
            'none': 'нет минут',
        },
    };
`;

const langKeys = await LangKeys.parse(str, 'taburet');
langKeys;
```

[RunKit live editor](https://runkit.com/godfreyd/5c348f9ec236980012045540).

