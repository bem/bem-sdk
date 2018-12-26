# presets

The package contains the default naming convention presets and the tool to create a custom naming conventions.

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.org/package/@bem/sdk.naming.presets
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.naming.presets.svg

* [Introduction](#introduction)
* [Try presets](#try-presets)
* [Quick start](#quick-start)
* [API Reference](#api-reference)
* [Parameter tuning](#parameter-tuning)
    * [Get the default preset](#get-the-default-preset)
    * [Use another preset as default](#use-another-preset-as-default)
    * [Pass an object with default options](#pass-an-object-with-default-options)
* [Naming conventions](#naming-conventions)

## Introduction

You can use this package to:

* import an existed preset with [naming convention](https://bem.info/methodology/naming-convention/);
* create a preset with a custom naming convention.

This package is useful when you want to create a new preset based on another preset, for example, to change only the modifier delimiter and keep other options unchanged.

> **Note.** If you don't have any BEM projects available to try out the `@bem/sdk.naming.presets` package, the quickest way to create one is to use [bem-express](https://github.com/bem/bem-express).

## Try presets

An example is available in the [RunKit editor](https://runkit.com/migs911/how-bem-sdk-naming-presets-works).

## Quick start

> **Attention.** To use `@bem/sdk.naming.presets`, you must install [Node.js 8.0+](https://nodejs.org/en/download/).

In this quick start you will learn, how to import a preset with naming convention and create a preset with a custom naming convention.

To run the `@bem/sdk.naming.presets` package:
1. [Install the `@bem/sdk.naming.presets` package](#installing-the-bemsdknamingpresets-package).
2. [Import a preset with naming convention](#importing-a-preset-with-naming-convention).
3. [Create preset with a custom naming convention](#creating-preset-with-a-custom-naming-convention).

### Installing the `@bem/sdk.naming.presets` package

To install the `@bem/sdk.naming.presets` package, run the following command:

```
$ npm install --save @bem/sdk.naming.presets
```

### Importing a preset with naming convention

To import preset with default naming convention, create a JavaScript file with any name (for example, **app.js**) and insert the following:

```js
const originNaming = require('@bem/sdk.naming.presets/origin');
```

This code imports the preset with origin naming convention. To import another preset type its' name instead of `origin`.

**Examples:**

```js
const legacyNaming = require('@bem/sdk.naming.presets/legacy');
const originReactNaming = require('@bem/sdk.naming.presets/origin-react');
const reactNaming = require('@bem/sdk.naming.presets/react');
const twoDashesNaming = require('@bem/sdk.naming.presets/two-dashes');
```

[RunKit live example](https://runkit.com/migs911/different-presets-from-bem-sdk-naming-presets-package).

After preset been imported you can use it for your purposes. For example, to create a `parse()` function from the [@bem/sdk.naming.entity.parse](https://github.com/bem/bem-sdk/tree/master/packages/naming.entity.parse) package.

**Example:**

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

[RunKit live example](https://runkit.com/migs911/parse-a-string-using-origin-naming-convention).

### Creating preset with a custom naming convention

To create a preset with a custom naming convention use the [create](#create) function. In the arguments pass options that you want to overwrite in the default naming convention. For example, you can define that the values of modifiers are delimited with the equal (`=`).

**Example:**

```js
const myNamingOptions = {
    delims: {
        mod: { val: '=' }
    }
};
const myNaming = require('@bem/sdk.naming.presets/create')(myNamingOptions);

// Parse a BEM entity name to test created preset.
const parse = require('@bem/sdk.naming.entity.parse')(myNaming);
parse('my-block_my-modifier=some-value');
/**
 * => BemEntityName {
 * block: 'my-block',
 * mod: { name: 'my-modifier', val: 'some-value' } }
 */
```

[RunKit live example](https://runkit.com/migs911/create-preset-with-a-custom-naming-convention).

## API Reference

#### create()

```js
/**
 * @typedef INamingConventionDelims
 * @property {string} elem — Separates an element name from block.
 * @property {string|Object} mod — Separates a modifier name and the value of a modifier.
 * @property {string} mod.name — Separates a modifier name from a block or an element.
 * @property {string|boolean} mod.val — Separates the value of a modifier from the modifier name.
 */

/**
 * Returns created preset with the specified naming convention.
 *
 * @param {(Object|string)} [options] — User options or the name of preset to return.
 *                                      If not specified, default preset will be returned.
 * @param {string} [options.preset] — Preset name that should be used as default preset.
 * @param {Object} [options.delims] — Strings to separate names of bem entities.
 *                                    This object has the same structure with `INamingConventionDelims`,
 *                                    but all properties inside are optional.
 * @param {Object} [options.fs] — User options to separate names of files with bem entities.
 * @param {Object} [options.fs.delims] — Strings to separate names of files in a BEM project.
 *                                       This object has the same structure with `INamingConventionDelims`,
 *                                       but all properties inside are optional.
 * @param {string} [options.fs.pattern] — Pattern that describes the file structure of a BEM project.s
 * @param {string} [options.fs.scheme] — Schema name that describes the file structure of one BEM entity.
 * @param {string} [options.wordPattern] — A regular expression that will be used to match an entity name.
 * @param {(Object|string)} [userDefaults] — User default options or the name of preset to use.
 *                                           If the name of preset incorrect `origin` preset will be used.
 * @returns {INamingConvention} — An object with `delims`, `fs` and `wordPattern` properties
 *                                that describes the naming convention.
 */
create(options, userDefaults);
```

This function will get all options from the default preset, overwrite them by passed options and return the result. Options are overwritten in the following order:

1. options from the default preset;
2. options from the `userDefaults` parameter;
3. options from the `options` parameter.

## Parameter tuning

### Get the default preset

You can use `create()` function to get the default preset from this package. Call `create()` function without parameters.

```js
const defaultPreset = require('@bem/sdk.naming.presets/create')();

// Check that origin preset is default.
const originPreset = require('@bem/sdk.naming.presets/origin');
if (defaultPreset === originPreset) {
    console.log('Origin is the default preset now.');
}
```

[RunKit live example](https://runkit.com/migs911/get-the-default-preset).

### Use another preset as default

The default preset is `origin`, but you can set another preset as default in the `options.preset` parameter.

**Example:**

```js
const myNamingOptions = {
    preset: 'two-dashes',
    delims: {
        mod: { val: '=' }
    }
};
const myNaming = require('@bem/sdk.naming.presets/create')(myNamingOptions);

// Parse a BEM entity name to test created preset.
const parse = require('@bem/sdk.naming.entity.parse')(myNaming);
parse('my-block--my-modifier=some-value');
/**
 * => BemEntityName {
 *   block: 'my-block',
 *   mod: { name: 'my-modifier', val: 'some-value' } }
 */
```

[RunKit live example](https://runkit.com/migs911/use-another-preset-as-default-via-presets-option).

You can set default preset in the `userDefaults` parameter. To use this method pass the name of preset in the second argument.

**Example:**

```js
const myNamingOptions = {
    delims: {
        mod: { val: '=' }
    }
};
const myNaming = require('@bem/sdk.naming.presets/create')(myNamingOptions, 'two-dashes');

// Parse a BEM entity name to test created preset.
const parse = require('@bem/sdk.naming.entity.parse')(myNaming);
parse('my-block--my-modifier=some-value');
/**
 * => BemEntityName {
 *   block: 'my-block',
 *   mod: { name: 'my-modifier', val: 'some-value' } }
 */
```

[RunKit live example](https://runkit.com/migs911/use-another-preset-as-default-via-userdefaults-option).

If you pass a preset name in the `userDefaults` parameter, it will completely overwrite the default preset. For example, all these lines return `two-dashes` preset:

```js
const createPreset = require('@bem/sdk.naming.presets/create');
const twoDashesPreset1 = createPreset({ preset:'legacy' }, 'two-dashes');
const twoDashesPreset2 = createPreset({}, 'two-dashes');
const twoDashesPreset3 = require('@bem/sdk.naming.presets/two-dashes');
```

### Pass an object with default options

You can pass an object with default options to use it in the `userDefaults` level. Pass this object in the second argument of the `create()` function.

**Example:**

```js
const userDefaults = {
    fs: {
        delims: {
            elem: '__',
            mod: '_'
        },
        scheme: 'flat'
    }
}

// Use well-known presets with the flat scheme.
const reactFlatPreset = require('@bem/sdk.naming.presets/create')({ preset: 'react' }, userDefaults);
const twoDashesFlatPreset = require('@bem/sdk.naming.presets/create')({ preset: 'two-dashes' }, userDefaults);

// Create a custom preset with the flat scheme.
const customPreset = require('@bem/sdk.naming.presets/create')({ wordPattern: '[a-z]+' }, userDefaults);

// Create preset with overwritten delimiters.
const presetOptions = {
    delims: {
        mod: { val: '='}
    },
    fs: {
        delims: {
            mod: { val: '='}
        }
    }
}
const anotherPreset = require('@bem/sdk.naming.presets/create')(presetOptions, userDefaults);
```

[RunKit live example](https://runkit.com/migs911/use-an-object-with-default-options-to-create-preset-with).


## Naming conventions

The main idea of the naming convention is to make names of [BEM entities](https://en.bem.info/methodology/key-concepts/#bem-entity) as informative and clear as possible.

This package contains follow presets with naming conventions:

* [origin](#origin) — default naming convention.
* [legacy](#legacy) — it's like origin naming convention, but with different file structure organization.
* [origin-react](#origin-react) — mix of origin and react naming conventions.
* [react](#react) — naming convention in React style.
* [two-dashes](#two-dashes) — according to this naming convention modifiers are delimited by two hyphens (`--`).

In addition, you can invent your naming convention. How to do this, see the [Custom naming convention](#custom-naming-convention) section.

### origin

The BEM methodology provides an idea for creating naming rules and implements that idea in its canonical naming convention: [origin naming convention](#origin-naming-convention).

**Word pattern:**

Every name must match the regular expression: `[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*`.

**Examples:** `my-element`, `myElement`, `element1`, `2element`.

**Delimiters:**

Elements are delimited with two underscores (`__`), modifiers and values of modifiers are delimited by one underscore (`_`).

Example: `my-block__my-element_my-modifier_some-value`.

**File structure:**

* BEM entities structure scheme: `nested`.
* Project structure pattern: `${layer?${layer}.}blocks/${entity}.${tech}`.

**Examples:**

```
blocks/my-block.js
blocks/my-block/_my-modifier.js
blocks/my-block/__my-element.js
blocks/my-block/__my-element/_my-modifier_some-value.css
layer.blocks/my-block/__my-element/_my-modifier_some-value.css
```

### legacy

This preset based on the [origin](#origin) preset but provides another project structure pattern.

**Word pattern:**

Every name must match the regular expression: `[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*`.

**Examples:** `my-element`, `myElement`, `element1`, `2element`.

**Delimiters:**

Elements are delimited with two underscores (`__`), modifiers and values of modifiers are delimited by one underscore (`_`).

Example: `my-block__my-element_my-modifier_some-value`.

**File structure:**

* BEM entities structure scheme: `nested`.
* Project structure pattern: `${entity}${layer?@${layer}}.${tech}`.

**Examples:**

```
my-block@layer.js
my-block/_my-modifier.js
my-block/__my-element@layer.js
my-block/__my-element/_my-modifier_some-value.css
my-block/__my-element/_my-modifier_some-value@layer.css
```

### origin-react

`origin-react` preset is an implementation of [React style](https://en.bem.info/methodology/naming-convention/#react-style) naming convention.

This preset based on the [origin](#origin) preset but provides another word pattern and element delimiters.

**Word pattern:**

Every name must match the regular expression: `[a-zA-Z0-9]+`.

**Examples:** `MyElement`, `myModifier`, `modValue1`.

**Delimiters:**

Elements are delimited by one hyphen (`-`), modifiers and values of modifiers are delimited by one underscore (`_`).

Example: `MyBlock-MyElement_myModifier_modValue`.

**File structure:**

* Element names in the file structure haven't any delimiter.
* BEM entities structure scheme: `nested`.
* Project structure pattern: `${layer?${layer}.}blocks/${entity}.${tech}`.

**Examples:**

```
blocks/MyBlock.js
blocks/MyBlock/_myModifier.js
blocks/MyBlock/MyElement.js
blocks/MyBlock/MyElement/_myModifier_modValue.css
layer.blocks/MyBlock/MyElement/_myModifier_modValue.css
```

### react

`react` preset is an implementation of [React style](https://en.bem.info/methodology/naming-convention/#react-style) naming convention.

This preset based on the [origin-react](#origin-react) preset but provides another project structure pattern like in the [legacy](#legacy) preset.

**Word pattern:**

Every name must match the regular expression: `[a-zA-Z0-9]+`.

**Examples:** `MyElement`, `myModifier`, `modValue1`.

**Delimiters:**

Elements are delimited by one hyphen (`-`), modifiers and values of modifiers are delimited by one underscore (`_`).

Example: `MyBlock-MyElement_myModifier_modValue`.

**File structure:**

* Element names in the file structure haven't any delimiter.
* BEM entities structure scheme: `nested`.
* Project structure pattern: `${entity}${layer?@${layer}}.${tech}`.

**Examples:**

```
MyBlock.js
MyBlock@layer.js
MyBlock/_myModifier.js
MyBlock/_myModifier@layer.js
MyBlock/MyElement/_myModifier_modValue.css
MyBlock/MyElement/_myModifier_modValue@layer.css
```

### two-dashes

`two-dashes` preset is an implementation of [Two Dashes style](https://en.bem.info/methodology/naming-convention/#two-dashes-style) naming convention.

This preset based on the [origin](#origin) preset but modifiers are delimited by two hyphens (`--`).

**Word pattern:**

Every name must match the regular expression: `[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*`.

**Examples:** `my-element`, `myElement`, `element1`, `2element`.

**Delimiters:**

Elements are delimited with two underscores (`__`), modifiers are delimited by two hyphens (`--`), and values of modifiers are delimited by one underscore (`_`).

Example: `my-block__my-element--my-modifier_some-value`.

**File structure:**

* BEM entities structure scheme: `nested`.
* Project structure pattern: `${layer?${layer}.}blocks/${entity}.${tech}`.

**Examples:**

```
blocks/my-block/--my-modifier.js
blocks/my-block/__my-element/--my-modifier_some-value.css
my-layer.blocks/my-block/__my-element/--my-modifier_some-value.css
```
