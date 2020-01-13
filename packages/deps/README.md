# deps

This is a tool for working with [dependencies](https://en.bem.info/technologies/classic/deps-spec/) in BEM.

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.org/package/@bem/sdk.deps
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.deps.svg

* [Introduction](#introduction)
* [Try deps](#try-deps)
* [Installation](#installation)
* [Quick start](#quick-start)
* [API reference](#api-reference)
* [License](#license)

## Introduction

Dependencies are defined as JavaScript objects in `.deps.js` files. They look like this:

```js
/* DEPS entity */
({
    block: 'block-name',
    elem: 'elem-name',
    mod: 'modName',
    val: 'modValue',
    tech: 'techName',
    shouldDeps: [ /* BEM entity */ ],
    mustDeps: [ /* BEM entity */ ],
    noDeps: [ /* BEM entity */ ]
})
```

Learn more in the [BEM technologies documentation](https://en.bem.info/technologies/classic/deps-spec/).

> **Note.** If you don't have any BEM projects available to try out the `@bem/sdk.decl` package, the quickest way to create one is to use [bem-express](https://github.com/bem/bem-express).

## Try deps

An example is available in the [RunKit editor](https://runkit.com/migs911/how-bem-sdk-deps-works).

## Installation

To install the `@bem/sdk.deps` package, run the following command:

```bash
npm install --save @bem/sdk.deps
```

## Quick start

> **Attention.** To use `@bem/sdk.deps`, you must install [Node.js 8.0+](https://nodejs.org/en/download/).

First [install the `@bem/sdk.deps` package](#installation). To run the package, follow these steps:

1. [Prepare files with dependencies](#preparing-files-with-dependencies).
1. [Create the project's configuration file](#defining-the-projects-configuration-file).
1. [Load dependencies from the file](#loading-dependencies-from-file).
1. [Create a BEM graph](#creating-a-bem-graph).

### Preparing files with dependencies

To work with dependencies, you need to define them in files with the `.deps.js` extension. If you don't have such files in your project, prepare them.

In this quick start, we will create a simplified file structure of a [bem-express](https://github.com/bem/bem-express) project:

```
app
├── .bemrc
├── app.js
├── common.blocks
│   ├── header
│   │   └── header.deps.js
│   ├── page
│   │   └── page.deps.js
└── development.blocks
    └── page
        └── page.deps.js
```

Define the dependencies in `.deps.js` files:

**common.blocks/page/page.deps.js:**

```js
({
    shouldDeps: [
        {
            mods: { view: ['404'] }
        },
        'header',
        'body',
        'footer'
    ]
})
```

**common.blocks/header/header.deps.js:**

```js
({
    shouldDeps: ['logo']
})
```

**development.blocks/page/page.deps.js:**

```js
({
    shouldDeps: 'livereload'
});
```

### Defining the project's configuration file

Create the project's configuration file. In this file, specify levels with paths to search for BEM entities and `*.deps.js` files.

You also need to specify level sets. Each set is a list of a level's layers. By default this tool will load dependencies for the `desktop` set.

**.bemrc:**

```js
module.exports = {
    root: true,

    levels: [
        { naming: 'legacy', layer: 'common',  path: 'common.blocks' },
        { naming: 'legacy', layer: 'development',  path: 'development.blocks' }
    ],
    sets: {
        'desktop': 'common',
        'development': 'common development'
    }
}
```

Read more about working with the configurations in the [`@bem/sdk.config`][config-package] package.

### Loading dependencies from file

Create a JavaScript file with any name (for example, **app.js**), and insert the following:

```js
const deps = require('@bem/sdk.deps');

(async () => {
    const dependencies = await deps.load({});
    dependencies.map(e => console.log(e.vertex.id + ' => ' + e.dependOn.id));
})().catch(e => console.error(e.stack));
// header => logo
// page => page_view
// page => page_view_404
// page => header
// page => body
// page => footer
```

This code will load the project's dependencies with default settings (for the `desktop` set) and print it to the console in a readable format.

Let's try to search `*.deps.js` files with dependencies in the `common.blocks` and `development.blocks` directories. To do it, use the `development` set, which includes both the `common` and the `development` set. Pass the set's name in the `platform` field.

**app.js:**

```js
const deps = require('@bem/sdk.deps');

(async () => {
    const platform = 'development';
    const dependencies = await deps.load({ platform });
    dependencies.map(e => console.log(e.vertex.id + ' => ' + e.dependOn.id));
})().catch(e => console.error(e.stack));
// header => logo
// page => page_view
// page => page_view_404
// page => header
// page => body
// page => footer
// page => livereload
```

This time, one more dependency was loaded (`page => livereload`).

### Creating a BEM graph

When we load dependencies from files, we can create a [graph][graph-package] from them and get an _ordered_ dependencies list for specified blocks, such as the `header` block.

To create a graph, use the `buildGraph()` method:

```js
deps.buildGraph(dependencies);
```

To get an _ordered_ dependencies list for specified blocks, use the [`dependciesOf()`](https://github.com/bem/bem-sdk/tree/master/packages/graph#bemgraphdependenciesof) method for the created graph.

```js
const graph = deps.buildGraph(dependencies);
console.log(graph.dependenciesOf({ block: 'header'}));
```

Add this code into your **app.js** file and run it:

```js
const deps = require('@bem/sdk.deps');

(async () => {
    const platform = 'development';
    const dependencies = await deps.load({ platform });
    dependencies.map(e => console.log(e.vertex.id + ' => ' + e.dependOn.id));

    const graph = deps.buildGraph(dependencies);
    console.log(graph.dependenciesOf({ block: 'header'}));
})().catch(e => console.error(e.stack));
// => [
//     { 'entity': { 'block': 'header'}},
//     { 'entity': { 'block': 'logo'}}
// ]
```

## API reference

* [load()](#load)
* [gather()](#gather)
* [read()](#read)
* [parse()](#parse)
* [buildGraph()](#buildgraph)

### load()

Loads data from the `deps.js` files in the project and returns an array of dependencies.

This method sequentially [gathers](#gather) the `deps.js` files, then [reads](#read) them and then [parses](#parse) the data in them.

```js
/**
 * @typedef {Object} DepsLink
 * @property {BemCell} vertex — An entity that depends on the entity from the `dependOn` field.
 * @property {BemCell} dependOn — The entity on which the `vertex` entity depends.
 * @property {boolean} [ordered] - `mustDeps` dependency if `true`.
 * @property {string} [path] - Path to deps.js file if exists.
 */

/**
 * @param {Object} config — An object with options to configure.
 * @param {BemConfig} [config.config] — The project's configuration. Read more in the `@bem/sdk.config` package.
 *                                      If not specified, the project's configuration
 *                                      file is used (`.bemrc`, `.bemrc.js` or `.bemrc.json`).
 * @param {Object} [format] — An object that contains functions to create `reader` and `parser`.
 *                            If the format is not specified, the files in the `formats/deps.js/` module's directory are used.
 * @param {Function} format.reader — A function to create a reader for the `deps.js` files.
 * @param {Function} format.parser  — A function to create a parser for the `deps.js` files.
 * @returns {Promise<Array<DepsLink>>}
 */
load(config, format)
```

[RunKit live example](https://runkit.com/migs911/bem-sdk-deps-load).

### gather()

Gathering `deps.js` files in the project. This method uses the [`@bem/sdk.walk`][walk-package] and [`@bem/sdk.config`][config-package] packages to get the project's dependencies.

```js
/**
 * @param {Object} opts — An object with options to configure.
 * @param {BemConfig} [opts.config] — The project's configuration.
 *                                    If not specified, the project's configuration
 *                                    file is used (`.bemrc`, `.bemrc.js` or `.bemrc.json`).
 * @param {BemConfig} [opts.platform='desktop'] — The name of the set of levels to gather `deps.js` files for.
 * @param {Object} [options.defaults={}] — Found configs are merged with this object.
 * @returns {Promise<Array<BemFile>>}
 */
gather(opts)
```

[RunKit live example](https://runkit.com/migs911/bem-sdk-deps-gather).

### read()

Creates a generic serial reader for [`BemFile`][file-package] objects. If the reader is not specified, the `formats/deps.js/reader.js` file is used.

This method returns a function that reads and evaluates `BemFile` objects with file data.

```js
/**
 * @param {function(f: BemFile): Promise<{file: BemFile, data: *, scope: BemEntityName}>} [reader] — A generic serial reader for `BemFile` objects.
 * @returns {Function}
 */
read(reader)
```

### parse()

Creates a parser to read data from [`BemFile`][file-package] objects returned by the [`read()`](#read) function and returns an array of dependencies.

With a returned array of dependencies, you can create a graph using the [`buildGraph()`](#buildGraph) function.

```js
/**
 * @typedef {Object} DepsData
 * @property {BemCell} [scope] - BEM cell object to use as a scope.
 * @property {BemEntityName} [entity] - Entity to use if no scope was passed.
 * @property {Array<DepsChunk>} data - Dependencies data.
 */

/**
 * @typedef {(string|Object)} DepsChunk
 * @property {string} [block] — Block name
 * @property {(DepsChunk|Array<DepsChunk>)} [elem] — Element name.
 * @property {string} [mod] — Modifier name.
 * @property {string} [val] — Modifier value.
 * @property {string} [tech] — Technology (for example, 'css').
 * @property {(DepsChunk|Array<DepsChunk>)} [elems] — Syntactic sugar that denotes `shouldDeps` dependency
 *                                                    on the specified elements.
 * @property {Array|Object} [mods] — Syntacic sugar that denotes `shouldDeps` dependency on the specified modifiers.
 * @property {(DepsChunk|Array<DepsChunk>)} [mustDeps] — An ordered dependency.
 * @property {(DepsChunk|Array<DepsChunk>)} [shouldDeps] — An unordered dependency.
 */

/**
 * @typedef {Object} DepsLink
 * @property {BemCell} vertex — An entity that depends on the entity from the `dependOn` field.
 * @property {BemCell} dependOn — The entity on which the `vertex` entity depends.
 * @property {boolean} [ordered] - `mustDeps` dependency if `true`.
 * @property {string} [path] - Path to deps.js file if exists.
 */

/**
 * @param {function} parser - Parses and evaluates BemFiles.
 * @returns {function(deps: (Array<DepsData>|DepsData)): Array<DepsLink>} }
 */
parse(parser)
```

[RunKit live example](https://runkit.com/migs911/bem-sdk-deps-parse).

### buildGraph()

Creates a graph from the dependencies list. [Read more][graph-package] about graphs and their methods.

```js
/**
 * @typedef {Object} DepsLink
 * @property {BemCell} vertex — An entity that depends on the entity from the `dependOn` field.
 * @property {BemCell} dependOn — The entity on which the `vertex` entity depends.
 * @property {boolean} [ordered] - `mustDeps` dependency if `true`.
 * @property {string} [path] - Path to deps.js file if exists.
 */

/**
 * @param {Array<DepsLink>} deps - List of dependencies.
 * @param {Object} options — An options used to create a graph.
 * @param {Boolean} denaturalized — If `true`, the created graph isn't naturalized.
 * @returns {BemGraph} — Graph of dependencies.
 */
buildGraph(deps, options)
```

## License

© 2019 [YANDEX LLC](https://yandex.com/company/). Code released under [Mozilla Public License 2.0](LICENSE.txt).


[cell-package]: https://github.com/bem/bem-sdk/tree/master/packages/cell
[file-package]: https://github.com/bem/bem-sdk/tree/master/packages/file
[graph-package]: https://github.com/bem/bem-sdk/tree/master/packages/graph
[walk-package]: https://github.com/bem/bem-sdk/tree/master/packages/walk
[config-package]: https://github.com/bem/bem-sdk/tree/master/packages/config
