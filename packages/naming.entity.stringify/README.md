# stringify

Stringifier for a [BEM entity](https://bem.info/methodology/key-concepts/#bem-entity) representation.

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.org/package/@bem/sdk.naming.entity.stringify
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.naming.entity.stringify.svg

* [Introduction](#introduction)
* [Try parse](#try-parse)
* [Quickstart](#quickstart)
* [API reference](#api-reference)
* [Parameter tuning](#parameter-tuning)
    * [Stringify BemEntityName object](#stringify-bementityname-object)
    * [Using custom naming convention](#using-custom-naming-convention)

## Introduction

Stringify returns the string with the name of specified entity representation. This name can be used in a class attributes.

You can choose [naming convention](https://en.bem.info/methodology/naming-convention/) used to create a `stingify()` function.

> **Note.** If you don't have any BEM projects available to try out the `@bem/sdk.naming.entity.stringify` package, the quickest way to create one is to use [bem-express](https://github.com/bem/bem-express).

## Try stringify

An example is available in the [RunKit editor](https://runkit.com/migs911/how-bem-sdk-naming-entity-stringify-works).

## Quickstart

> **Attention.** To use `@bem/sdk.naming.entity.stringify`, you must install [Node.js 8.0+](https://nodejs.org/en/download/).

To run the `@bem/sdk.naming.entity.stringify` package:

1. [Installing required packages](#install-packages).
3. [Creating a stingify() function](#creating-a-stringify-function).
4. [Making a string from BEM entity](#stringify-bem-entity).

### Installing required packages

Install the following packages:

* [@bem/sdk.naming.entity.stringify](https://www.npmjs.org/package/@bem/sdk.naming.entity.stringify) that contains `stingify()` function;
* [@bem/sdk.naming.presets](https://www.npmjs.com/package/@bem/sdk.naming.presets) that contains presets with well-known naming conventions.

To install the packages, run the following command:

```
$ npm install --save @bem/sdk.naming.entity.stringify @bem/sdk.naming.presets
```

### Creating a stingify() function

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
stringify({ block: 'button', mod: 'checked' });
```

This function will return the string `button_checked`.

**Examples**: ([RunKit live example](https://runkit.com/migs911/stringify-quickst-using-origin-naming-convention))

```js
const originNaming = require('@bem/sdk.naming.presets/origin');
const stringify = require('@bem/sdk.naming.entity.stringify')(originNaming);

console.log(stringify({ block: 'button', mod: 'checked' }));
// => button_checked

// You can define the modifier as an object.
console.log(stringify({ block: 'button', mod: { name: 'checked'}}));
// => button_checked

console.log(stringify({ block: 'button', elem: 'run' }));
// => button__run

console.log(stringify({ block: 'button',
                        elem: 'run',
                        mod: 'activated'}));
// => button__run_activated

console.log(stringify({ block: 'button',
                        elem: 'run',
                        mod: { name: 'color', val: 'red'}}));
// => button__run_color_red
```

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

### Stringify BemEntityName object

You can stringify any object that has required elements, for example [BemEntityName](https://github.com/bem/bem-sdk/tree/master/packages/entity-name) object:

**Example:** ([RunKit live example](https://runkit.com/migs911/usage-examples-stringify-bementityname-object))

```js
const originNaming = require('@bem/sdk.naming.presets/origin');
const stringify = require('@bem/sdk.naming.entity.stringify')(originNaming);
const BemEntityName = require('@bem/sdk.entity-name');

const entity = new BemEntityName({ block: 'button', mod: 'checked' });

console.log(stringify(entity));
// => button_checked
```


### Using custom naming convention

Specify an [INamingConvention](https://github.com/bem/bem-sdk/blob/master/packages/naming.presets/index.d.ts#L10) object with the `delims` field — delimiters, used to separate names in naming convention.

Use this object to make your `stingify()` function.

**Example:** ([RunKit live example](https://runkit.com/migs911/stringify-usage-examples-custom-naming-convention))

```js
const convention = {
    delims: {
        elem: '_EL-',
        mod: {
            name: '_MOD-',
            val: '-'
    }}};
const stringify = require('@bem/sdk.naming.entity.stringify')(convention);

console.log(stringify({ block: 'button',
                        elem: 'run',
                        mod: 'activated'}));
```

This code will print `button_EL-run_MOD-activated` to console.
