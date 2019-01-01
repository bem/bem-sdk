# naming.cell.stringify

Stringifier for a BEM cell object.

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.org/package/@bem/sdk.naming.cell.stringify
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.naming.cell.stringify.svg

* [Introduction](#introduction)
* [Try stringify](#try-stringify)
* [Quick start](#quick-start)
* [API reference](#api-reference)
* [Parameter tuning](#parameter-tuning)

## Introduction

Stringify returns the file path for a specified BEM cell object.

You can choose a preset with [naming convention](https://en.bem.info/methodology/naming-convention/) for creating a `stringify()` function. See the full list of supported presets in the `@bem/sdk.naming.presets` package [documentation](https://github.com/bem/bem-sdk/tree/master/packages/naming.presets#naming-conventions).

All provided presets uses the [`nested`](https://en.bem.info/methodology/filestructure/#nested) file structure scheme. To use the [`flat`](https://en.bem.info/methodology/filestructure/#flat) scheme that is better for small projects, see [Using a custom naming convention](#using-a-custom-naming-convention) section.

> **Note.** If you don't have any BEM projects available to try out the `@bem/sdk.naming.cell.stringify` package, the quickest way to create one is to use [bem-express](https://github.com/bem/bem-express).

## Try stringify

An example is available in the [RunKit editor](https://runkit.com/migs911/how-bem-sdk-naming-cell-stringify-works).

## Quick start

> **Attention.** To use `@bem/sdk.naming.cell.stringify`, you must install [Node.js 8.0+](https://nodejs.org/en/download/).

To run the `@bem/sdk.naming.cell.stringify` package:

1. [Install required packages](#installing-required-packages).
2. [Create a `stringify()` function](#creating-a-stringify-function).
3. [Create a BEM cell object](#creating-a-bem-cell-object).
4. [Get a file path](#getting-a-file-path).

### Installing required packages

Install the following packages:

* [@bem/sdk.naming.cell.stringify](https://www.npmjs.org/package/@bem/sdk.naming.cell.stringify), which makes the `stringify()` function.
* [@bem/sdk.naming.presets](https://www.npmjs.com/package/@bem/sdk.naming.presets), which contains presets with well-known naming conventions.
* [@bem/sdk.cell](https://www.npmjs.com/package/@bem/sdk.cell), which allows you create a BEM cell objects to stringify.

To install these packages, run the following command:

```
$ npm install --save @bem/sdk.naming.cell.stringify @bem/sdk.naming.presets @bem/sdk.cell
```

### Creating a `stringify()` function

Create a JavaScript file with any name (for example, **app.js**) and do the following:

1. Choose the [naming convention](https://bem.info/methodology/naming-convention/) and import the preset with this convention (for example, origin naming convention).
    See the full list of supported presets in the `@bem/sdk.naming.presets` package [documentation](https://github.com/bem/bem-sdk/tree/master/packages/naming.presets#naming-conventions).
1. Import the `@bem/sdk.naming.cell.stringify` package and create the `stringify()` function using the imported preset:

```js
const originNaming = require('@bem/sdk.naming.presets/origin');
const stringify = require('@bem/sdk.naming.cell.stringify')(originNaming);
```

### Creating a BEM cell object

Create a BEM cell object to stringify. You can use the [create()](https://github.com/bem/bem-sdk/tree/master/packages/cell#createobject) function from the `@bem/sdk.cell` package.

```js
const BemCell = require('@bem/sdk.cell');

var myBemCell;
myBemCell = BemCell.create({block: 'my-block', tech: 'css' });
```

### Getting a file path

Stringify the created BEM cell object:

```js
stringify(myBemCell);
```

This function will return the string with file path `common.blocks/my-block/my-block.css`.

**Example:**

```js
const originNaming = require('@bem/sdk.naming.presets/origin');
const stringify = require('@bem/sdk.naming.cell.stringify')(originNaming);

const BemCell = require('@bem/sdk.cell');

var myBemCell;
myBemCell = BemCell.create({block: 'my-block', tech: 'css' });
console.log(stringify(myBemCell));
// => common.blocks/my-block/my-block.css

myBemCell = BemCell.create({block: 'my-block',
                            tech: 'js' });
console.log(stringify(myBemCell));
// => common.blocks/my-block/my-block.js

myBemCell = BemCell.create({block: 'my-block',
                            layer: 'my-layer',
                            tech: 'css' });
console.log(stringify(myBemCell));
// => my-layer.blocks/my-block/my-block.css

myBemCell = BemCell.create({block: 'my-block',
                            mod: 'my-modifier',
                            tech: 'css' });
console.log(stringify(myBemCell));
// => common.blocks/my-block/_my-modifier/my-block_my-modifier.css

myBemCell = BemCell.create({block: 'my-block',
                            mod: 'my-modifier',
                            val: 'some-value',
                            tech: 'css' });
console.log(stringify(myBemCell));
// => common.blocks/my-block/_my-modifier/my-block_my-modifier_some-value.css

myBemCell = BemCell.create({block: 'my-block',
                            elem: 'my-element',
                            tech: 'css' });
console.log(stringify(myBemCell));
// => common.blocks/my-block/__my-element/my-block__my-element.css

myBemCell = BemCell.create({block: 'my-block',
                            elem: 'my-element',
                            mod: 'my-modifier',
                            tech: 'css' });
console.log(stringify(myBemCell));
// => common.blocks/my-block/__my-element/_my-modifier/my-block__my-element_my-modifier.css
```

[RunKit live example](https://runkit.com/migs911/naming-cell-stringify-stringify-using-origin-convention).

## API reference

### stringify()

```js
/**
 * @typedef BemCell — Representation of cell.
 * @property {BemEntityName} entity — Representation of entity name.
 * @property {string} tech — Tech of cell.
 * @property {string} [layer] — Layer of cell.
 */

/**
 * Forms a file according to object representation of BEM cell.
 *
 * @param {Object|BemCell} cell — Object representation of BEM cell.
 * @returns {string} — File path for the BEM cell. This name can be used in class attributes.
 */
stringify(cell);
```

## Parameter tuning

### Using a custom naming convention

To create a preset with a custom naming convention use the `create()` function from the `@bem/sdk.naming.presets` package.

For example create a preset that uses [flat](https://en.bem.info/methodology/filestructure/#flat) scheme to describe a file structure organization.

Use the created preset to make your `stringify()` function.

**Example:**

```js
const options = {
        fs: { scheme: 'flat' }
    };
const originFlatNaming = require('@bem/sdk.naming.presets/create')(options);
const stringify = require('@bem/sdk.naming.cell.stringify')(originFlatNaming);

const BemCell = require('@bem/sdk.cell');

var myBemCell;
myBemCell = BemCell.create({block: 'my-block',
                        tech: 'css' });
console.log(stringify(myBemCell));
// => common.blocks/my-block.css

myBemCell = BemCell.create({block: 'my-block',
                        tech: 'js' });
console.log(stringify(myBemCell));
// => common.blocks/my-block.js

myBemCell = BemCell.create({block: 'my-block',
                        layer: 'my-layer',
                        tech: 'css' });
console.log(stringify(myBemCell));
// => my-layer.blocks/my-block.css

myBemCell = BemCell.create({block: 'my-block',
                        mod: 'my-modifier',
                        tech: 'css' });
console.log(stringify(myBemCell));
// => common.blocks/my-block_my-modifier.css

myBemCell = BemCell.create({block: 'my-block',
                        mod: 'my-modifier',
                        val: 'some-value',
                        tech: 'css' });
console.log(stringify(myBemCell));
// => common.blocks/my-block_my-modifier_some-value.css

myBemCell = BemCell.create({block: 'my-block',
                        elem: 'my-element',
                        tech: 'css' });
console.log(stringify(myBemCell));
// => common.blocks/my-block__my-element.css

myBemCell = BemCell.create({block: 'my-block',
                        elem: 'my-element',
                        mod: 'my-modifier',
                        tech: 'css' });
console.log(stringify(myBemCell));
// => common.blocks/my-block__my-element_my-modifier.css
```

[RunKit live example](https://runkit.com/migs911/naming-cell-stringify-using-a-custom-naming-convention).

See more examples of creating presets in the `@bem/sdk.naming.presets` package [documentation](https://github.com/bem/bem-sdk/tree/master/packages/naming.presets).