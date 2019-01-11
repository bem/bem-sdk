# naming.cell.pattern-parser

Parser for the path pattern from a preset with a naming convention.

This is an internal package that is used in the `@bem/sdk.naming.cell.stringify` and `@bem/sdk.naming.cell.match` packages.

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.org/package/@bem/sdk.naming.cell.pattern-parser
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.naming.cell.pattern-parser.svg

* [Introduction](#introduction)
* [Try pattern-parser](#try-pattern-parser)
* [Quick start](#quick-start)
* [API reference](#api-reference)

## Introduction

The tool parses a pattern and creates an array with separate elements from the pattern.

The pattern describes the file structure organization of a BEM project. For example, the `${layer?${layer}.}blocks/${entity}.${tech}` pattern matches the file path: `my-layer.blocks/my-file.css`.

> **Note.** If you don't have any BEM projects available to try out the `@bem/sdk.naming.cell.stringify` package, the quickest way to create one is to use [bem-express](https://github.com/bem/bem-express).

## Try pattern-parser

An example is available in the [RunKit editor](https://runkit.com/migs911/how-bem-sdk-naming-cell-pattern-parser-works).

## Quick start

> **Attention.** To use `@bem/sdk.naming.cell.pattern-parser`, you must install [Node.js 8.0+](https://nodejs.org/en/download/).

In this quick start you will learn how to use this package to parse the path pattern from the `origin` preset.

To run the `@bem/sdk.naming.cell.pattern-parser` package:

1. [Install required packages](#installing-required-packages).
2. [Create a `parse()` function](#creating-a-parse-function).
3. [Parse the path pattern](#parsing-the-path-pattern-from-the-origin-preset).

### Installing required packages

Install the following packages:

* [@bem/sdk.naming.cell.pattern-parser](https://www.npmjs.org/package/@bem/sdk.naming.cell.pattern-parser), which contains the `parse()` function.
* [@bem/sdk.naming.presets](https://www.npmjs.com/package/@bem/sdk.naming.presets), which contains presets with well-known naming conventions.

To install the packages, run the following command:

```
$ npm install --save @bem/sdk.naming.cell.pattern-parser @bem/sdk.naming.presets
```

### Creating a `parse()` function

Create a JavaScript file with any name (for example, **app.js**) and insert the following:

```js
const parse = require('@bem/sdk.naming.cell.pattern-parser');
```

After that you can use the `parse()` function to parse a path pattern.

### Parsing the path pattern from the origin preset

To parse a pattern, use the created function.

The pattern from the `origin` preset is equal to `${layer?${layer}.}blocks/${entity}.${tech}`. Parse this pattern.

```js
const originNaming = require('@bem/sdk.naming.presets/origin');

parse(originNaming.fs.pattern);
// => ['', ['layer', '', 'layer', '.'], 'blocks/', 'entity', '.', 'tech']
```

[RunKit live example](https://runkit.com/migs911/parse-a-pattern-from-the-origin-preset)

## API reference

### parse()

Parses a path pattern into array representation.

```js
/**
 * @param {string} pattern — Template-string-like pattern that describes
 *                           the file structure organization of a BEM project.
 * @returns {Array} — Array with separated elements from the pattern.
 */
parse(pattern);
```
