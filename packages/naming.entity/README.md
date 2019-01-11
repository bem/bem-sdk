# naming.entity

The tool for working with [BEM entity](https://en.bem.info/methodology/key-concepts/#bem-entity) representations:

* parse a [string representation](#string-representation);
* stringify an [object representation](#object-representation).

[![NPM Status][npm-img]][npm]

[npm]:            https://www.npmjs.org/package/@bem/sdk.naming.entity
[npm-img]:        https://img.shields.io/npm/v/@bem/sdk.naming.entity.svg

* [Introduction](#introduction)
* [Try naming.entity](#try-namingentity)
* [Quick start](#quick-start)
* [API Reference](#api-reference)
* [Parameter tuning](#parameter-tuning)
* [Usage examples](#usage-examples)

## Introduction

This package combines the capabilities of the following packages:
* [@bem/sdk.naming.parse](https://github.com/bem/bem-sdk/tree/master/packages/naming.entity.parse) — to create a [parse()](#parse) function.
* [@bem/sdk.naming.stringify](https://github.com/bem/bem-sdk/tree/master/packages/naming.entity.stringify) — to create a [stringify()](#stringify) function.
* [@bem/sdk.naming.presets](https://github.com/bem/bem-sdk/tree/master/packages/naming.presets) — to select a [naming convention](https://bem.info/methodology/naming-convention/) for these functions.

    Various naming conventions are supported, such as [origin](https://en.bem.info/methodology/naming-convention/#naming-rules), [two-dashes](https://en.bem.info/methodology/naming-convention/#two-dashes-style) and [react](https://en.bem.info/methodology/naming-convention/#react-style). See the full list of supported presets in the package [documentation](https://github.com/bem/bem-sdk/tree/migelle-naming-presets-doc/packages/naming.presets#naming-conventions).

    You can also [create](#using-a-custom-naming-convention) a custom naming convention and use it for creating the `parse()` and `stringify()` functions.

## Try naming.entity

An example is available in the [RunKit editor](https://runkit.com/migs911/how-bem-sdk-naming-entity-works).

## Quick start

> **Attention.** To use `@bem/sdk.naming.entity`, you must install [Node.js 8.0+](https://nodejs.org/en/download/).

To run the `@bem/sdk.naming.entity` package:

* [Install `naming.entity`](#installing-the-bemsdknamingentity-package).
* [Create a `naming.entity` instance](#creating-a-namingentity-instance).
* [Use the created instance](#using-the-created-instance).

### Installing the `@bem/sdk.naming.entity` package

To install the `@bem/sdk.naming.entity` package, run the following command:

```
$ npm install --save @bem/sdk.naming.entity
```

### Creating a `naming.entity` instance

To create a `naming.entity` instance, insert the following lines into your code:

```js
const bemNaming = require('@bem/sdk.naming.entity');
```

By default, the created instance is based on the `origin` preset that represents the default naming convention for BEM entities. To use another preset, see [Using the specified naming convention](#using-the-specified-naming-convention).

### Using the created instance

Now you can use the created instance to parse and stringify BEM entity name representations.

#### Parse a string representation

```js
bemNaming.parse('my-block__my-element');
```

This code will return the BemEntityName object with the block name `my-block` and the element name `my-element`.

#### Stringify an object representation

```js
bemNaming.stringify({ block: 'my-block', mod: 'my-modifier' });
```

This code will return the string `my-block_my-modifier`.


## API Reference

* [bemNaming()](#bemnaming)
* [parse()](#parse)
* [stringify()](#stringify)

### bemNaming()

This function creates a `naming.entity` instance with the [parse()](#parse) and [stringify()](#stringify) functions.

```js
/**
 * @typedef INamingConventionDelims
 * @property {string} elem — Separates an element name from block.
 * @property {string|Object} mod — Separates a modifier name and the value of a modifier.
 * @property {string} mod.name — Separates a modifier name from a block or an element.
 * @property {string|boolean} mod.val — Separates the value of a modifier from the modifier name.
 */

/**
 * @param {(Object|string)} [options] — User options or the name of the preset to return.
 *                                      If not specified, the default preset will be used.
 * @param {string} [options.preset] — Preset name that should be used as the default preset.
 * @param {Object} [options.delims] — Strings to separate names of bem entities.
 *                                    This object has the same structure as `INamingConventionDelims`,
 *                                    but all properties inside are optional.
 * @param {string} [options.wordPattern] — A regular expression that will be used to match an entity name.
 * @returns {Object} — Created instance with the `parse()` and `stringify()` functions.
 */
create(options);
```

**Examples:**

```js
const defaultNaming = require('@bem/sdk.naming.entity');
const reactNaming = require('@bem/sdk.naming.entity')('react');
const customNaming = require('@bem/sdk.naming.entity'){ wordPattern: '[a-z]+' };
```

See more examples in the [Parameter tuning](#parameter-tuning) section.

### parse()

Parses the string with a BEM entity name into an object representation.

```js
/**
 * @typedef BemEntityName
 * @property {string} block — Block name.
 * @property {string} [elem] — Element name.
 * @property {string|Object} [mod] — Modifier name or object with name and value.
 * @property {string} mod.name — Modifier name.
 * @property {string} [mod.val=true] — Modifier value.
 */

/**
 * @param {string} str — String representation of a BEM entity.
 * @returns {(BemEntityName|undefined)}
 */
parse(str);
```

**Example:**

```js
const bemNaming = require('@bem/sdk.naming.entity');

bemNaming.parse('my-block__my-element_my-modifier_some-value');
// => BemEntityName {
//     block: 'my-block',
//     elem: 'my-element',
//     mod: { name: 'my-modifier', val: 'some-value' }
// }
```

For more information about the `parse()` function, see the `@bem/sdk.naming.parse` package [documentation](https://github.com/bem/bem-sdk/tree/master/packages/naming.entity.parse).

### stringify()

Forms a string from the object that specifies a BEM entity name.

```js
/**
 * @typedef BemEntityName
 * @property {string} block — Block name.
 * @property {string} [elem] — Element name.
 * @property {string|Object} [mod] — Modifier name or object with name and value.
 * @property {string} mod.name — Modifier name.
 * @property {string|boolean} [mod.val] — Modifier value.
 */

/**
 * @param {object|BemEntityName} entity — Object representation of a BEM entity.
 * @returns {string} — BEM entity name. This name can be used in class attributes.
 */
stringify(entity);
```

**Example:**

```js
const bemNaming = require('@bem/sdk.naming.entity');

const bemEntityName = {
    block: 'my-block',
    elem: 'my-element',
    mod: { name: 'my-modifier', val: 'some-value' }
}

console.log(bemNaming.stringify(bemEntityName));
// => my-block__my-element_my-modifier_some-value
```

For more information about the `stringify()` function, see the `@bem/sdk.naming.stringify` package [documentation](https://github.com/bem/bem-sdk/tree/master/packages/naming.entity.stringify).

## Parameter tuning

* [Using a specified naming convention](#using-a-specified-naming-convention)
* [Using a custom naming convention](#using-a-custom-naming-convention)
* [Using another preset as default](#using-another-preset-as-default)

### Using a specified naming convention

The [@bem/sdk.naming.presets](https://github.com/bem/bem-sdk/tree/master/packages/naming.presets) package provides presets with various naming conventions.

Specify the name of a preset to use in the [bemNaming()](#bemnaming) function. See the full list of supported presets in the package [documentation](https://github.com/bem/bem-sdk/tree/migelle-naming-presets-doc/packages/naming.presets#naming-conventions).

**Example:**

```js
const createBemNaming = require('@bem/sdk.naming.entity');
const myEntity = {
    block: 'my-block',
    elem: 'my-element',
    mod: {
        name: 'my-modifier',
        val: 'some-value'
    }
};

// Create the new instance from the `two-dashes` preset.
const twoDashes = createBemNaming('two-dashes');
twoDashes.stringify(myEntity);
// => my-block__my-element--my-modifier_some-value

// Create an instance from the `react` preset.
const react = createBemNaming('react');
react.stringify(myEntity);
// => my-block-my-element_my-modifier_some-value
```

[RunKit live example](https://runkit.com/migs911/naming-entity-using-the-specified-naming-convention).

### Using a custom naming convention

To use a custom naming convention, create an object that will overwrite the default naming convention parameters. Pass this object in the [bemNaming()](#bemnaming) function.

For example, overwrite the modifier value delimiter and use the equal sign (`=`) as the delimiter.

**Example:**

```js
const createBemNaming = require('@bem/sdk.naming.entity');
const myNamingOptions = {
    delims: {
        mod: { val: '=' }
    }
};
const myNaming = createBemNaming(myNamingOptions);

// Parse a BEM entity name to test created instance.
myNaming.parse('my-block_my-modifier=some-value');
/**
 * => BemEntityName {
 *  block: 'my-block',
 *  mod: { name: 'my-modifier', val: 'some-value' } }
 */

// Stringify an object representation of the BEM entity name.
const myEntity = {
    block: 'my-block',
    elem: 'my-element',
    mod: {
        name: 'my-modifier',
        val: 'some-value'
    }
};
myNaming.stringify(myEntity);
// => my-block__my-element_my-modifier=some-value
```

[RunKit live example](https://runkit.com/migs911/naming-entity-using-a-custom-naming-convention).

### Using another preset as default

The default preset is `origin`, but you can set another preset as default in the `options.preset` parameter.

For example, set the `two-dashes` preset as the default and create a `naming.entity` instance based on it.

**Example:**

```js
const createBemNaming = require('@bem/sdk.naming.entity');
const myNamingOptions = {
    preset: 'two-dashes',
    delims: {
        mod: { val: '=' }
    }
};

const myNaming = createBemNaming(myNamingOptions);

// Parse a BEM entity name to test created preset.
myNaming.parse('my-block--my-modifier=some-value');
/**
 * => BemEntityName {
 * block: 'my-block',
 * mod: { name: 'my-modifier', val: 'some-value' } }
 */

// Stringify an object representation of the BEM entity name.
const myEntity = {
    block: 'my-block',
    elem: 'my-element',
    mod: {
        name: 'my-modifier',
        val: 'some-value'
    }
};
myNaming.stringify(myEntity);
// => my-block__my-element--my-modifier=some-value
```

[RunKit live example](https://runkit.com/migs911/naming-entity-use-another-preset-as-default).

## Usage examples

### Convert a string to the Two Dashes style

In this example, we will convert the string from the [origin](https://en.bem.info/methodology/naming-convention/#naming-rules) naming convention to [Two Dashes](https://en.bem.info/methodology/naming-convention/#two-dashes-style).

Origin: `my-block__my-element_my-modifier_some-value`

Two Dashes: `my-block__my-element--my-modifier_some-value`

**Example:**

```js
const originNaming = require('@bem/sdk.naming.entity');
const twoDashesNaming = require('@bem/sdk.naming.entity')('two-dashes');

const bemEntityNameStr = 'my-block__my-element_my-modifier_some-value'

const bemEntityNameObj = originNaming.parse(bemEntityName);
// => BemEntityName {
//     block: 'my-block',
//     elem: 'my-element',
//     mod: { name: 'my-modifier', val: 'some-value' }
// }

twoDashesNaming.stringify(bemEntityNameObj);
// => my-block__my-element--my-modifier_some-value
```

[RunKit live example](https://runkit.com/migs911/naming-entity-convert-a-string-to-another-naming-convention).
