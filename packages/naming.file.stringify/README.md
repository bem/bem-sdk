# naming.file.stringify

Stringifier for a BEM file.

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.org/package/@bem/sdk.naming.file.stringify
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.naming.file.stringify.svg

* [Introduction](#introduction)
* [Try stringify](#try-stringify)
* [Quick start](#quick-start)
* [API reference](#api-reference)
* [Parameter tuning](#parameter-tuning)

## Introduction

Stringify returns the file path for a specified BEM file object.

You can choose a preset with a [naming convention](https://en.bem.info/methodology/naming-convention/) for creating a `stringify()` function. See the full list of supported presets in the `@bem/sdk.naming.presets` package [documentation](https://github.com/bem/bem-sdk/tree/master/packages/naming.presets#naming-conventions).

All provided presets use the [`nested`](https://en.bem.info/methodology/filestructure/#nested) file structure. To use the [`flat`](https://en.bem.info/methodology/filestructure/#flat) structure that is better for small projects, see [Using a custom naming convention](#using-a-custom-naming-convention).

> **Note.** If you don't have any BEM projects available to try out the `@bem/sdk.naming.file.stringify` package, the quickest way to create one is to use [bem-express](https://github.com/bem/bem-express).

## Try stringify

An example is available in the [RunKit editor](https://runkit.com/migs911/how-bem-sdk-naming-file-stringify-works).

## Quick start

> **Attention.** To use `@bem/sdk.naming.file.stringify`, you must install [Node.js 8.0+](https://nodejs.org/en/download/).

To run the `@bem/sdk.naming.file.stringify` package:

1. [Install required packages](#installing-required-packages).
2. [Create a `stringify()` function](#creating-a-stringify-function).
3. [Create a BEM file object](#creating-a-bem-file-object).
4. [Getting a file path](#getting-a-file-path).

### Installing required packages

Install the following packages:

* [@bem/sdk.naming.file.stringify](https://www.npmjs.org/package/@bem/sdk.naming.file.stringify), which makes the `stringify()` function.
* [@bem/sdk.naming.presets](https://www.npmjs.com/package/@bem/sdk.naming.presets), which contains presets with well-known naming conventions.
* [@bem/sdk.file](https://www.npmjs.com/package/@bem/sdk.file), which allows you create BEM file objects to stringify.

To install these packages, run the following command:

```
$ npm install --save @bem/sdk.naming.file.stringify @bem/sdk.naming.presets @bem/sdk.file
```

### Creating a `stringify()` function

Create a JavaScript file with any name (for example, **app.js**) and do the following:

1. Choose the [naming convention](https://bem.info/methodology/naming-convention/) and import the preset with this convention (for example, origin naming convention).
    See the full list of supported presets in the `@bem/sdk.naming.presets` package [documentation](https://github.com/bem/bem-sdk/tree/master/packages/naming.presets#naming-conventions).
1. Import the `@bem/sdk.naming.file.stringify` package and create the `stringify()` function using the imported preset:

```js
const originNaming = require('@bem/sdk.naming.presets/origin');
const stringify = require('@bem/sdk.naming.file.stringify')(originNaming);
```

### Creating a BEM file object

Create a BEM file object to stringify. You can use the [create()](https://github.com/bem/bem-sdk/tree/master/packages/file#createobject) function from the `@bem/sdk.file` package.

```js
const BemFile = require('@bem/sdk.file');

var myFile;
myFile = BemFile.create({block: 'my-block', tech: 'css' });
```

### Getting a file path

Stringify the created BEM file object:

```js
stringify(myFile);
```

This function will return the string with the file path `common.blocks/my-block/my-block.css`.

**Example:**

```js
const originNaming = require('@bem/sdk.naming.presets/origin');
const stringify = require('@bem/sdk.naming.file.stringify')(originNaming);

const BemFile = require('@bem/sdk.file');

var myFile;
myFile = BemFile.create({block: 'my-block', tech: 'css' });
console.log(stringify(myFile));
// => common.blocks/my-block/my-block.css

myFile = BemFile.create({block: 'my-block',
                         tech: 'js',
                         level: 'bem-files'});
console.log(stringify(myFile));
// => bem-files/common.blocks/my-block/my-block.js

myFile = BemFile.create({block: 'my-block',
                         tech: 'css',
                         layer: 'desktop',
                         level: 'bem-files'});
console.log(stringify(myFile));
// => bem-files/desktop.blocks/my-block/my-block.css

myFile = BemFile.create({block: 'my-block',
                         tech: 'css',
                         level: 'my-project/bem-files'});
console.log(stringify(myFile));
// => my-project/bem-files/common.blocks/my-block/my-block.css

myFile = BemFile.create({block: 'my-block',
                         mod: 'my-modifier',
                         val: 'some-value',
                         tech: 'css',
                         level: 'bem-files'});
console.log(stringify(myFile));
// => bem-files/common.blocks/my-block/_my-modifier/my-block_my-modifier_some-value.css

myFile = BemFile.create({block: 'my-block',
                         elem: 'my-element',
                         mod: 'my-modifier',
                         tech: 'css',
                         level: 'bem-files' });
console.log(stringify(myFile));
// => bem-files/common.blocks/my-block/__my-element/_my-modifier/my-block__my-element_my-modifier.css
```

[RunKit live example](https://runkit.com/migs911/naming-file-stringify-using-origin-convention).

## API reference

### stringify()

```js
/**
 * @typedef BemFile — Representation of file.
 * @property {BemCell} cell — Representation of a BEM cell.
 * @property {String} [level] — Base level path.
 * @property {String} [path] — Path to file.
 */

/**
 * Forms a file according to object representation of BEM file.
 *
 * @param {Object|BemFile} file — Object representation of BEM file.
 * @returns {string} — File path.
 */
stringify(file);
```

## Parameter tuning

### Using a custom naming convention

To create a preset with a custom naming convention, use the `create()` function from the `@bem/sdk.naming.presets` package.

For example, create a preset that uses the [`flat`](https://en.bem.info/methodology/filestructure/#flat) scheme to describe the file structure organization.

Use the created preset to make your `stringify()` function.

**Example:**

```js
const options = {
        fs: { scheme: 'flat' }
    };
const originFlatNaming = require('@bem/sdk.naming.presets/create')(options);
const stringify = require('@bem/sdk.naming.file.stringify')(originFlatNaming);

const BemFile = require('@bem/sdk.file');

var myFile;
myFile = BemFile.create({block: 'my-block', tech: 'css' });
console.log(stringify(myFile));
// => common.blocks/my-block.css

myFile = BemFile.create({block: 'my-block',
                     tech: 'js',
                     level: 'bem-files'});
console.log(stringify(myFile));
// => bem-files/common.blocks/my-block.js

myFile = BemFile.create({block: 'my-block',
                     tech: 'css',
                     layer: 'desktop',
                     level: 'bem-files'});
console.log(stringify(myFile));
// => bem-files/desktop.blocks/my-block.css

myFile = BemFile.create({block: 'my-block',
                     tech: 'css',
                     level: 'my-project/bem-files'});
console.log(stringify(myFile));
// => my-project/bem-files/common.blocks/my-block.css

myFile = BemFile.create({block: 'my-block',
                     mod: 'my-modifier',
                     val: 'some-value',
                     tech: 'css',
                     level: 'bem-files'});
console.log(stringify(myFile));
// => bem-files/common.blocks/my-block_my-modifier_some-value.css

myFile = BemFile.create({block: 'my-block',
                     elem: 'my-element',
                     mod: 'my-modifier',
                     tech: 'css',
                     level: 'bem-files' });
console.log(stringify(myFile));
// => bem-files/common.blocks/my-block__my-element_my-modifier.css
```

[RunKit live example](https://runkit.com/migs911/naming-file-stringify-stringify-using-a-custom-naming-convention).

See more examples of creating presets in the `@bem/sdk.naming.presets` package [documentation](https://github.com/bem/bem-sdk/tree/master/packages/naming.presets).
