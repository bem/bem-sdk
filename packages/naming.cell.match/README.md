# naming.cell.match

Parser for the file path of a BEM cell object.

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.org/package/@bem/sdk.naming.cell.match
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.naming.cell.match.svg

* [Introduction](#introduction)
* [Try match](#try-match)
* [Quick start](#quick-start)
* [API reference](#api-reference)
* [Parameter tuning](#parameter-tuning)

## Introduction

The tool checks if the specified file path can be a path of a BEM cell. This tool can also be used to parse the file path and create a BEM cell object from it.

You can choose a preset with a [naming convention](https://en.bem.info/methodology/naming-convention/) for creating a `match()` function. See the full list of supported presets in the `@bem/sdk.naming.presets` package [documentation](https://github.com/bem/bem-sdk/tree/master/packages/naming.presets#naming-conventions).

All provided presets use the [`nested`](https://en.bem.info/methodology/filestructure/#nested) file structure. To use the [`flat`](https://en.bem.info/methodology/filestructure/#flat) structure that is better for small projects, see [Using a custom naming convention](#using-a-custom-naming-convention).

> **Note.** If you don't have any BEM projects available to try out the `@bem/sdk.naming.cell.match` package, the quickest way to create one is to use [bem-express](https://github.com/bem/bem-express).

## Try match

An example is available in the [RunKit editor](https://runkit.com/migs911/how-bem-sdk-naming-cell-match-works).

## Quick start

> **Attention.** To use `@bem/sdk.naming.cell.match`, you must install [Node.js 8.0+](https://nodejs.org/en/download/).

To run the `@bem/sdk.naming.cell.match` package:

1. [Install required packages](#installing-required-packages).
2. [Create a `match()` function](#creating-a-match-function).
3. [Create a BEM cell object](#creating-a-bem-cell-object).
4. [Get a file path](#getting-a-file-path).

### Installing required packages

Install the following packages:

* [@bem/sdk.naming.cell.match](https://www.npmjs.org/package/@bem/sdk.naming.cell.match), which makes the `match()` function.
* [@bem/sdk.naming.presets](https://www.npmjs.com/package/@bem/sdk.naming.presets), which contains presets with well-known naming conventions.

To install these packages, run the following command:

```
$ npm install --save @bem/sdk.naming.cell.match @bem/sdk.naming.presets
```

### Creating a `match()` function

Create a JavaScript file with any name (for example, **app.js**) and do the following:

1. Choose the [naming convention](https://bem.info/methodology/naming-convention/) and import the preset with this convention (for example, origin naming convention).
    See the full list of supported presets in the `@bem/sdk.naming.presets` package [documentation](https://github.com/bem/bem-sdk/tree/master/packages/naming.presets#naming-conventions).
1. Import the `@bem/sdk.naming.cell.match` package and create the `match()` function using the imported preset:

```js
const originNaming = require('@bem/sdk.naming.presets/origin');
const match = require('@bem/sdk.naming.cell.match')(originNaming);
```

### Check a correct file path

Check a file path:

```js
match('my-layer.blocks/my-block/my-block.js').isMatch;
// => true
```

This function also converts the path to a BemCell object and returns it.

```js
match('my-layer.blocks/my-block/my-block.js').cell.valueOf();
// => {entity: {block: "my-block"}, tech: "js", layer: "my-layer"}
```

### Check an incorrect file path

If the file path is incorrect, the `isMatch` value will be `false` but the BemCell object can still be created. This will happen if the file path has some additional text at the end. The extra text will be written in the `rest` value.

```js
let incorrectPath = 'my-layer.blocks/my-block/my-block.js_some-text';
match(incorrectPath);
// => {cell: BemCell, isMatch: false, rest: "_something"}
match(incorrectPath).cell.valueOf();
// => {entity: {block: "my-block"}, tech: "js", layer: "my-layer"}
```

If the file path hasn't been parsed, the `cell` and `rest` values will be `null`.

```js
incorrectPath = 'some incorrect string';
match(incorrectPath);
// => {cell: null, isMatch: false, rest: null}
```

The file path may look correct, but it does not match the file structure pattern from the used preset:

```js
incorrectPath = 'my-block/my-block.js';
match(incorrectPath);
// => {cell: null, isMatch: false, rest: null}
```

**Example:**

```js
const originNaming = require('@bem/sdk.naming.presets/origin');
const match = require('@bem/sdk.naming.cell.match')(originNaming);

// Examples with correct paths.

let correctPath = 'my-layer.blocks/my-block/my-block.js';
match(correctPath).isMatch;
// => true
match(correctPath).cell.valueOf();
// => {entity: {block: "my-block"}, tech: "js", layer: "my-layer"}

correctPath = 'common.blocks/my-block/_my-modifier/my-block_my-modifier.css';
match(correctPath).isMatch;
// => true
match(correctPath).cell.valueOf();
// => {entity: { block: "my-block", mod: {name: "my-modifier", val: true}}, tech: "js", layer: "my-layer"}

// Examples with incorrect paths.

let incorrectPath = 'my-layer.blocks/my-block/my-block.js_some-text';
match(incorrectPath);
// => {cell: BemCell, isMatch: false, rest: "_something"}
match(incorrectPath).cell.valueOf();
// => {entity: {block: "my-block"}, tech: "js", layer: "my-layer"}

incorrectPath = 'some incorrect string';
match(incorrectPath);
// => {cell: null, isMatch: false, rest: null}

incorrectPath = 'my-block/my-block.js';
match(incorrectPath);
// => {cell: null, isMatch: false, rest: null}
```

[RunKit live example](https://runkit.com/migs911/naming-cell-match-using-origin-naming-convention).

## API reference

### match()

Tries to convert the specified path to a BEM cell object and return an object that contains the result.

The returned object has the follow properties:

* `cell` — converted BEM cell.
* `isMatch` — `true` if the path matches a BEM cell and `false` if not.
* `rest` — some additional text at the end of the path. If the value is not `null` then the `isMatch` value will be `false`.


```js
/**
 * @typedef BemCell — Representation of cell.
 * @property {BemEntityName} entity — Representation of entity name.
 * @property {string} tech — Tech of cell.
 * @property {string} [obj.layer] — Layer of cell.
 */

/**
 * @param {string} path — Object representation of the BEM cell.
 * @returns {cell: ?BemCell, isMatch: boolean, rest: ?string}
 */
match(path);
```

## Parameter tuning

### Using a custom naming convention

To create a preset with a custom naming convention, use the `create()` function from the `@bem/sdk.naming.presets` package.

For example, create a preset that uses the [flat](https://en.bem.info/methodology/filestructure/#flat) scheme to describe the file structure organization.

Use the created preset to make your `match()` function.

**Example:**

```js
const options = {
        fs: { scheme: 'flat' }
    };
const originFlatNaming = require('@bem/sdk.naming.presets/create')(options);
const match = require('@bem/sdk.naming.cell.match')(originFlatNaming);

// Examples with correct paths.

let correctPath = 'my-layer.blocks/my-block.js';
match(correctPath).isMatch;
// => true
match(correctPath).cell.valueOf();
// => {entity: {block: "my-block"}, tech: "js", layer: "my-layer"}

correctPath = 'common.blocks/my-block_my-modifier.css';
match(correctPath).isMatch;
// => true
match(correctPath).cell.valueOf();
// => {entity: { block: "my-block", mod: {name: "my-modifier", val: true}}, tech: "js", layer: "my-layer"}

// Examples with incorrect paths.

let incorrectPath = 'my-layer.blocks/my-block.js_some-text';
match(incorrectPath);
// => {cell: BemCell, isMatch: false, rest: "_something"}
match(incorrectPath).cell.valueOf();
// => {entity: {block: "my-block"}, tech: "js", layer: "my-layer"}

incorrectPath = 'some incorrect string';
match(incorrectPath);
// => {cell: null, isMatch: false, rest: null}

incorrectPath = 'my-block/my-block.js';
match(incorrectPath);
// => {cell: null, isMatch: false, rest: null}
```

[RunKit live example](https://runkit.com/migs911/naming-cell-match-using-a-custom-naming-convention).

See more examples of creating presets in the `@bem/sdk.naming.presets` package [documentation](https://github.com/bem/bem-sdk/tree/master/packages/naming.presets).
