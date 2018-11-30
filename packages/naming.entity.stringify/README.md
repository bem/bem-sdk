# stringify

Stringifier for a [BEM entity](https://bem.info/methodology/key-concepts/#bem-entity) representation.

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.org/package/@bem/sdk.naming.entity.stringify
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.naming.entity.stringify.svg

* [Introduction](#introduction)
* [Try stringify](#try-stringify)
* [Quick start](#quick-start)
* [API reference](#api-reference)
* [Parameter tuning](#parameter-tuning)

## Introduction

Stringify returns the string with the name of specified BEM entity representation. This name can be used in a class attributes.

You can choose [naming convention](https://en.bem.info/methodology/naming-convention/) used to create a `stingify()` function.

> **Note.** If you don't have any BEM projects available to try out the `@bem/sdk.naming.entity.stringify` package, the quickest way to create one is to use [bem-express](https://github.com/bem/bem-express).

## Try stringify

An example is available in the [RunKit editor](https://runkit.com/migs911/how-bem-sdk-naming-entity-stringify-works).

## Quick start

> **Attention.** To use `@bem/sdk.naming.entity.stringify`, you must install [Node.js 8.0+](https://nodejs.org/en/download/).

To run the `@bem/sdk.naming.entity.stringify` package:

1. [Install required packages](#installing-required-packages).
3. [Create a stringify() function](#creating-a-stringify-function).
4. [Make a string from BEM entity](#creating-a-string-from-a-bem-entity-name).

### Installing required packages

Install the following packages:

* [@bem/sdk.naming.entity.stringify](https://www.npmjs.org/package/@bem/sdk.naming.entity.stringify) that contains `stingify()` function;
* [@bem/sdk.naming.presets](https://www.npmjs.com/package/@bem/sdk.naming.presets) that contains presets with well-known naming conventions.

To install the packages, run the following command:

```
$ npm install --save @bem/sdk.naming.entity.stringify @bem/sdk.naming.presets
```

### Creating a `stringify()` function

Create a JavaScript file with any name (for example, **app.js**) and do the following:

1. Choose [naming convention](https://bem.info/methodology/naming-convention/) and import preset with this convention, for example, origin naming convention.
1. Import `@bem/sdk.naming.entity.stringify` package and create `string()` function using imported preset:

```js
const originNaming = require('@bem/sdk.naming.presets/origin');
const stringify = require('@bem/sdk.naming.entity.stringify')(originNaming);
```

### Creating a string from a BEM entity name

Stringify an object representation of BEM entity:

```js
stringify({ block: 'my-block', mod: 'my-modifier' });
```

This function will return the string `my-block_my-modifier`.

**Example**:

```js
const originNaming = require('@bem/sdk.naming.presets/origin');
const stringify = require('@bem/sdk.naming.entity.stringify')(originNaming);

console.log(stringify({ block: 'my-block', mod: 'my-modifier' }));
// => my-block_my-modifier

console.log(stringify({ block: 'my-block', mod: { name: 'my-modifier'}}));
// => my-block_my-modifier

console.log(stringify({ block: 'my-block',
                        mod: { name: 'my-modifier', val: 'some-value'}}));
// => my-block__my-modifier_some-value

console.log(stringify({ block: 'my-block', elem: 'my-element' }));
// => my-block__my-element

console.log(stringify({ block: 'my-block',
                        elem: 'my-element',
                        mod: 'my-modifier'}));
// => my-block__my-element_my-modifier

console.log(stringify({ block: 'my-block',
                        elem: 'my-element',
                        mod: { name: 'my-modifier', val: 'some-value'}}));
// => my-block__my-element_my-modifier_some-value
```

[RunKit live example](https://runkit.com/migs911/stringify-using-origin-convention).

## API reference

### stringify()

```js
/**
 * @typedef BemEntityName
 * @property {string} block — block name.
 * @property {string} [elem] — element name.
 * @property {string|Object} [mod] — modifier name or object with name and value.
 * @property {string} mod.name — modifier name.
 * @property {string|boolean} [mod.val] — modifier value.
 */

/**
 * Forms a string according to object representation of BEM entity.
 *
 * @param {object|BemEntityName} entity - object representation of BEM entity.
 * @returns {string} - BEM entity name. This name can be used in class attributes.
 */
stringify(entity);
```

## Parameter tuning

### Using custom naming convention

Specify an [INamingConvention](https://github.com/bem/bem-sdk/blob/master/packages/naming.presets/index.d.ts#L10) object with the `delims` field — delimiters, used to separate names in naming convention.

Use this object to make your `stingify()` function.

**Example:**

```js
const convention = {
    delims: {
        elem: '_EL-',
        mod: {
            name: '_MOD-',
            val: '-'
    }}};
const stringify = require('@bem/sdk.naming.entity.stringify')(convention);

console.log(stringify({ block: 'myBlock',
                        elem: 'myElement',
                        mod: 'myModifier'}));
// => myBlock_EL-myElement_MOD-myModifier
```

[RunKit live example](https://runkit.com/migs911/stringify-usage-examples-custom-naming-convention).