# parse

Parser for a [BEM entity](https://bem.info/methodology/key-concepts/#bem-entity) string representation.

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.org/package/@bem/sdk.naming.entity.parse
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.naming.entity.parse.svg

* [Introduction](#introduction)
* [Try parse](#try-parse)
* [Quick start](#quick-start)
* [API reference](#api-reference)
* [Parameter tuning](#parameter-tuning)
    * [Using Two Dashes style](#using-two-dashes-style)
    * [Using React style](#using-react-style)
    * [Using a custom naming convention](#using-a-custom-naming-convention)
* [Usage examples](#usage-examples)
    * [Parsing filenames](#parsing-filenames)

## Introduction

The tool parses a [BEM entity](https://bem.info/methodology/key-concepts/#bem-entity) string representation and creates an object representation from it.

You can choose which [naming convention](https://bem.info/methodology/naming-convention/) to use for creating a `parse()` function.

> **Note.** If you don't have any BEM projects available to try out the `@bem/sdk.naming.entity.parse` package, the quickest way to create one is to use [bem-express](https://github.com/bem/bem-express).

## Try parse

An example is available in the [RunKit editor](https://runkit.com/migs911/how-bem-sdk-naming-entity-parse-works).

## Quick start

> **Attention.** To use `@bem/sdk.naming.entity.parse`, you must install [Node.js 8.0+](https://nodejs.org/en/download/).

To run the `@bem/sdk.naming.entity.parse` package:

1. [Install required packages](#installing-required-packages).
1. [Create a parse() function](#creating-a-parse-function).
1. [Parse a string](#parsing-a-string).

### Installing required packages

Install the following packages:

* [@bem/sdk.naming.entity.parse](https://www.npmjs.org/package/@bem/sdk.naming.entity.parse), which contains the `parse()` function.
* [@bem/sdk.naming.presets](https://www.npmjs.com/package/@bem/sdk.naming.presets), which contains presets with well-known naming conventions.

To install the packages, run the following command:

```
$ npm install --save @bem/sdk.naming.entity.parse @bem/sdk.naming.presets
```

### Creating a `parse()` function

Create a JavaScript file with any name (for example, **app.js**) and do the following:

1. Choose the [naming convention](https://bem.info/methodology/naming-convention/) and import the preset with this convention (for example, origin naming convention).

    For examples with other naming conventions, see the [Parameter tuning](#parameter-tuning) section.
1. Import the `@bem/sdk.naming.entity.parse` package and create the `parse()` function using the imported preset:

```js
const originNaming = require('@bem/sdk.naming.presets/origin');
const parse = require('@bem/sdk.naming.entity.parse')(originNaming);
```

### Parsing a string

Parse a string representation of a BEM entity:

```js
parse('button__run');
```

This function will return the [BemEnityName](https://github.com/bem/bem-sdk/tree/master/packages/entity-name) object with the block name `button` and the element name `run`.

**Example**:

```js
const originNaming = require('@bem/sdk.naming.presets/origin');
const parse = require('@bem/sdk.naming.entity.parse')(originNaming);

// Parse a block name.
parse('my-block');

// Parse an element name.
parse('my-block__my-element');

// Parse a block modifier name.
parse('my-block_my-modifier');

// Parse a block modifier name with a value.
parse('my-block_my-modifier_some-value');

// Parse an element modifier name.
parse('my-block__my-element_my-modifier');

// Parse an element modifier name with a value.
parse('my-block__my-element_my-modifier_some-value');
```

Also you can normalize a returned [BemEnityName](https://github.com/bem/bem-sdk/tree/master/packages/entity-name) object with the [valueOf()](https://github.com/bem/bem-sdk/tree/master/packages/entity-name#valueof) function:

```js
parse('my-block__my-element_my-modifier_some-value').valueOf();
// => Object { block: "my-block",
//             elem: "my-element",
//             mod: Object {name: "my-modifier", val: "some-value"}}
```

[RunKit live example](https://runkit.com/migs911/parse-a-string-using-origin-naming-convention)

## API reference

### parse()

Parses string into object representation.

```js
/**
 * @typedef BemEntityName
 * @property {string} block — Block name.
 * @property {string} [elem] — Element name.
 * @property {Object} [mod] — Modifier name or object with name and value.
 * @property {string} mod.name — Modifier name.
 * @property {string} [mod.val=true] — modifier value.
 */

/**
 * @param {string} str — String representation of a BEM entity.
 * @returns {(BemEntityName|undefined)}
 */
parse(str);
```

## Parameter tuning

### Using Two Dashes style

Parse a string using the [Two Dashes style](https://bem.info/methodology/naming-convention/#two-dashes-style) naming convention.

**Example:**

```js
const twoDashesNaming = require('@bem/sdk.naming.presets/two-dashes');
const parse = require('@bem/sdk.naming.entity.parse')(twoDashesNaming);

// Parse a block name.
parse('my-block');

// Parse an element name.
parse('my-block__my-element');

// Parse a block modifier name.
parse('my-block--my-modifier');

// Parse a block modifier name with a value.
parse('my-block--my-modifier_some-value');

// Parse an element modifier name.
parse('my-block__my-element--my-modifier');

// Parse an element modifier name with a value.
parse('my-block__my-element--my-modifier_some-value');
```

[RunKit live example](https://runkit.com/migs911/parse-a-string-using-two-dashes-style)

### Using React style

Parse a string using the [React style](https://bem.info/methodology/naming-convention/#react-style) naming convention.

For creating a parse function there is no difference between the `react` and `origin-react` presets. You can use either of them.

**Example:**

```js
const reactNaming = require('@bem/sdk.naming.presets/react');
const parse = require('@bem/sdk.naming.entity.parse')(reactNaming);

// Parse a block name.
parse('myBlock');

// Parse an element name.
parse('myBlock-myElement');

// Parse a block modifier name.
parse('myBlock_myModifier');

// Parse a block modifier name with a value.
parse('myBlock_myModifier_value');

// Parse an element modifier name.
parse('myBlock-myElement_myModifier');

// Parse an element modifier name with a value.
parse('myBlock-myElement_myModifier_value');
```

[RunKit live example](https://runkit.com/migs911/parse-a-string-using-react-style)

### Using a custom naming convention

Specify an [INamingConvention](https://github.com/bem/bem-sdk/blob/master/packages/naming.presets/index.d.ts#L10) object with the following fields:

* `delims` — the delimiters that are used to separate names in the naming convention.
* `wordPattern` — a regular expression that will be used to match an entity name.

Use this object to make your `parse()` function.

**Example:**

```js
const convention = {
    wordPattern: '\\w+?',
    delims: {
        elem: '_EL-',
        mod: {
            name: '_MOD-',
            val: '-'
    }}};
const parse = require('@bem/sdk.naming.entity.parse')(convention);

// Parse an element modifier name.
console.log(parse('myBlock_EL-myElement_MOD-myModifier'));
/**
 * => BemEntityName {
 * block: 'myBlock',
 * elem: 'myElement',
 * mod: { name: 'myModifier', val: true } }
 */
```

[RunKit live example](https://runkit.com/migs911/parse-usage-examples-custom-naming-convention)

## Usage examples

### Parsing filenames

If you have the `input_type_search.css` file, you can parse the filename and get the [BemEnityName](https://github.com/bem/bem-sdk/tree/master/packages/entity-name) object that represents this file. You can parse all files in your project this way.

The `parse()` function uses in the walk package to parse filenames in the BEM project. You can find more examples in the walkers' code for following the [file structure organization](https://bem.info/methodology/filestructure): [Flat](https://github.com/bem/bem-sdk/blob/master/packages/walk/lib/walkers/flat.js) and [Nested](https://github.com/bem/bem-sdk/blob/master/packages/walk/lib/walkers/nested.js).