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
* [Parameters tuning](#parameters-tuning)
* [Usage examples](#usage-examples)

## Introduction

This package combines the capabilities of the packages:
* [@bem/sdk.naming.parse](https://github.com/bem/bem-sdk/tree/master/packages/naming.entity.parse) — to create a [parse()](#parse) function.
* [@bem/sdk.naming.stringify](https://github.com/bem/bem-sdk/tree/master/packages/naming.entity.stringify) — to create a [stringify()](#stringify) function.
* [@bem/sdk.naming.presets](https://github.com/bem/bem-sdk/tree/master/packages/naming.presets) — to select a [naming convention](https://bem.info/methodology/naming-convention/) for these functions.

    Various naming conventions are supported such as [origin](https://en.bem.info/methodology/naming-convention/#naming-rules), [two-dashes](https://en.bem.info/methodology/naming-convention/#two-dashes-style) or [react](https://en.bem.info/methodology/naming-convention/#react-style). See the full list of supported presets in the package [documentation](https://github.com/bem/bem-sdk/tree/migelle-naming-presets-doc/packages/naming.presets#naming-conventions).

    Also you can [create](#using-a-custom-naming-convention) a custom naming convention and use it for creating the `parse()` and `stringify()` functions.

## Try naming.entity

An example is available in the [RunKit editor](https://runkit.com/migs911/how-bem-sdk-naming-entity-works).

## Quick start

> **Attention.** To use `@bem/sdk.naming.entity`, you must install [Node.js 8.0+](https://nodejs.org/en/download/).

To run the `@bem/sdk.naming.entity` package:

* [Install `naming.entity`](#installing-bemsdknamingentity-package).
* [Create a `naming.entity` instance](#creating-a-namingentity-instance).
* [Use the created instance](#using-the-created-instance).

### Installing `@bem/sdk.naming.entity` package

To install the `@bem/sdk.naming.entity` package, run the following command:

```
$ npm install --save @bem/sdk.naming.entity
```

### Creating a `naming.entity` instance

To create a `naming.entity` instance insert the following into your code:

```js
const bemNaming = require('@bem/sdk.naming.entity');
```

By default the created instance is based on the `origin` preset, that represents the default naming convention for BEM entities. To use another preset, see the [Using the specified naming convention](#using-the-specified-naming-convention) section.

### Using the created instance

Now you can use the created instance to parse and stringify a BEM entity name representations.

#### Parse a string representation

```js
bemNaming.parse('my-block__my-element');
```

This code will return the BemEnityName object with block name `my-block` and element name `my-element`.

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
 * @property {string} elem — separates an element name from block.
 * @property {string|Object} mod — separates a modifier name and the value of a modifier.
 * @property {string} mod.name — separates a modifier name from a block or an element.
 * @property {string|boolean} mod.val — separates the value of a modifier from the modifier name.
 */

/**
 * Returns created  with the specified naming convention.
 *
 * @param {(Object|string)} [options] — user options or the name of preset to return.
 *                                      If not specified, default preset will be returned.
 * @param {string} [options.preset] — preset name that should be used as default preset.
 * @param {Object} [options.delims] — strings to separate names of bem entities.
 *                                    This object has the same structure with `INamingConventionDelims`,
 *                                    but all properties inside are optional.
 * @param {Object} [options.fs] — user options to separate names of files with bem entities.
 * @param {Object} [options.fs.delims] — strings to separate names of files in a BEM project.
 *                                       This object has the same structure with `INamingConventionDelims`,
 *                                       but all properties inside are optional.
 * @param {string} [options.fs.pattern] — pattern that describes the file structure of a BEM project.s
 * @param {string} [options.fs.scheme] — schema name that describes the file structure of one BEM entity.
 * @param {string} [options.wordPattern] — a regular expression that will be used to match an entity name.
 * @returns {INamingConvention} — an object with `delims`, `fs` and `wordPattern` properties
 *                                that describes the naming convention.
 */
create(options);
```

**Examples:**

```js
const defaultNaming = require('@bem/sdk.naming.entity');
const reactNaming = require('@bem/sdk.naming.entity')('react');
const customNaming = require('@bem/sdk.naming.entity'){ wordPattern: '[a-z]+' };
```

See more examples in the [Parameter tuning](#parameters-tuning) section.

### parse()

This function parses the string with a BEM entity name into object representation.

```js
/**
 * @typedef BemEntityName
 * @property {string} block — block name.
 * @property {string} [elem] — element name.
 * @property {string|Object} [mod] — modifier name or object with name and value.
 * @property {string} mod.name — modifier name.
 * @property {string} [mod.val=true] — modifier value.
 */

/**
 * Parses string into object representation.
 *
 * @param {string} str - string representation of a BEM entity.
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

This function forms a string from the object that specifies a BEM entity name.

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
 * Forms a string according to object representation of a BEM entity.
 *
 * @param {object|BemEntityName} entity - object representation of a BEM entity.
 * @returns {string} - BEM entity name. This name can be used in class attributes.
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

## Parameters tuning

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

To use a custom naming convention create an object that will overwrite the default naming convention parameters. Pass this object in the [bemNaming()](#bemnaming) function.

For example overwrite the modifier value delimiter and use the equal sign (`=`) as the delimiter.

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

For example set the `two-dashes` preset as the default and create a `naming.entity` instance based on it.

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

In this example we will convert the string from the [origin](https://en.bem.info/methodology/naming-convention/#naming-rules) naming convention to the [Two Dashes](https://en.bem.info/methodology/naming-convention/#two-dashes-style).

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