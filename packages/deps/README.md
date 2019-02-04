# deps

The tool to work with [DEPS](https://en.bem.info/technologies/classic/deps-spec/) specifications in BEM.

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

DEPS is a technology for defining dependencies in BEM.

Dependencies are defined as JavaScript objects in files with the `.deps.js` extension and look like this:

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

[Read more](https://en.bem.info/technologies/classic/deps-spec/) in the BEM technologies documentation.

## Try deps

An example is available in the [RunKit editor](https://runkit.com/migs911/how-bem-sdk-deps-works).

## Installation

To install the `@bem/sdk.deps` package, run the following command:

```bash
npm install --save @bem/sdk.deps
```

After installation you can include this package into your code:

```js
const deps = require('@bem/sdk.deps');
```

## Quick start

> **Attention.** To use `@bem/sdk.deps`, you must install [Node.js 8.0+](https://nodejs.org/en/download/).

In this quick start we will use the [bem-express](https://github.com/bem/bem-express) project, so you may want to clone it before we start.

To run the `@bem/sdk.deps` package:

1. [Create the project's configuration file](#defining-the-projects-configuration-file)
2. [Load dependencies from file](#loading-dependencies-from-file)
3. [Create a BEM graph](#creating-a-bem-graph)

### Defining the project's configuration file

Let's you have a BEM project with the created `*.deps.js` files for project's entities.

Specify the project's settings in the project's configuration file. Put it in the application's root directory.

**.bemsrc file example:**

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

### Loading dependencies from file

Create a JavaScript file with any name (for example, **app.js**) and insert the following:

```js
const deps = require('@bem/sdk.deps');

(async () => {
    const dependencies = await deps.load({});
    dependencies.map(e => console.log(e.vertex.id + ' => ' + e.dependOn.id));
})().catch(e => console.error(e.stack));
// header => logo
// logo => link
// page => page_view
// page => page_view_404
// page => header
// page => body
// page => footer
// root => page
```

This code will load the project's dependencies with default setting and print it to console in a readable format.

By default it loads dependencies for the `desktop` level set which includes only `common` layer. So the tool will search `*.deps.js` files only in the `common.blocks` directory.

Let's try to search `*.deps.js` files with dependencies in the `common.blocks` and `development.blocks` directories. To do it we will use the `development` set, which includes both `common` and `development` sets. Pass the set's name in the `platform` field.

**app.js:**

```js
const deps = require('@bem/sdk.deps');

(async () => {
    const platform = 'development';
    const dependencies = await deps.load({ platform });
    dependencies.map(e => console.log(e.vertex.id + ' => ' + e.dependOn.id));
})().catch(e => console.error(e.stack));
// header => logo
// logo => link
// page => page_view
// page => page_view_404
// page => header
// page => body
// page => footer
// root => page
// page => livereload
```

In this time one more dependency was load (`page => livereload`).

### Creating a BEM graph

When we load dependencies from files we can create a [graph][graph-package] from them and get an _ordered_ dependencies list for specified blocks, for example the `header` block.

To create a graph use the `buildGraph()` method:

```js
deps.buildGraph(dependencies);
```

To get an _ordered_ dependencies list for specified blocks use the [`dependciesOf()`](https://github.com/bem/bem-sdk/tree/master/packages/graph#bemgraphdependenciesof) method for the created graph.

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
//     { 'entity': { 'block': 'logo'}},
//     { 'entity': { 'block': 'link'}}
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

This method sequentially [gathers](#gather) the `deps.js` files, then [reads](#read) them and then [parses](#parse) the data from them.

```js
/**
 * @typedef {Object} DepsLink
 * @property {BemCell} vertex
 * @property {BemCell} dependOn
 * @property {boolean} [ordered] - `mustDeps` if set to true
 * @property {string} [path] - path to deps.js file if exists
 */

/**
 * @param {Object} config — an object with options to configure. Read more in the
 * @param {BemConfig} [config.config] — object that specify project's configuration.
 *                                    If not specified the project's configuration
 *                                    file will be used (`.bemrc`, `.bemrc.js` or `.bemrc.json`).
 * @param {Object} [format] — an object which contains functions to create `reader` and `parser`.
 *                            If format not specified the files in `formats/deps.js/` module's directory will be used.
 * @param {Function} format.reader — a function to create reader for the `deps.js` files.
 * @param {Function} format.parser  — a function to create parser for the `deps.js` files.
 * @returns {Promise<Array<DepsLink>>}
 */
load(config, format)
```

[RunKit live example](https://runkit.com/migs911/bem-sdk-deps-load).

### gather()

Gathering `deps.js` files in the project. This method uses [`@bem/sdk.walk`][walk-package] and [`@bem/sdk.config`][config-package] packages to get project's dependencies.

```js
/**
 * @param {Object} opts — an object with options to configure.
 * @param {BemConfig} [opts.config] — object that specify project's configuration.
 *                                    If not specified the project's configuration
 *                                    file will be used (`.bemrc`, `.bemrc.js` or `.bemrc.json`).
 * @param {BemConfig} [opts.platform='desktop'] — name of the level set to gather `deps.js` files for.
 * @param {Object} [options.defaults={}] — use this object as fallback for found configs.
 * @returns {Promise<Array<BemFile>>}
 */
gather(opts)
```

[RunKit live example](https://runkit.com/migs911/bem-sdk-deps-gather).

### read()

Creates a generic serial reader for [`BemFile`][file-package] objects. If reader not specified the `formats/deps.js/reader.js` file will be used.

This method returns a function that reads and evaluates `BemFile` objects with data from files.

```js
/**
 * @param {function(f: BemFile): Promise<{file: BemFile, data: *, scope: BemEntityName}>} [reader]
 * @returns {Function}
 */
read(reader)
```

### parse()

Creates a parser to read data from [`BemFile`][file-package] objects returned by the [`read()`](#read) function and returns an array of dependencies.

With returned array of dependencies you can create a graph using the [`buildGraph()`](#buildGraph) function.

```js
/**
 * @typedef {Object} DepsData
 * @property {BemCell} [scope] - BEM cell object to use as a scope.
 * @property {BemEntityName} [entity] - Entity to use if no scope was passed.
 * @property {Array<DepsChunk>} data - dependencies data.
 */

/**
 * @typedef {(string|Object)} DepsChunk
 * @property {string} [block] — a block name
 * @property {(DepsChunk|Array<DepsChunk>)} [elem] — an element name.
 * @property {string} [mod] — a modifier name.
 * @property {string} [val] — a modifier value.
 * @property {string} [tech] — a technology (for example, 'css').
 * @property {(DepsChunk|Array<DepsChunk>)} [elems] — syntacic sugar that means `shouldDeps` dependency
 *                                                    from the specified elements.
 * @property {Array|Object} [mods] — syntacic sugar that means `shouldDeps` dependency from the specified modifiers.
 * @property {(DepsChunk|Array<DepsChunk>)} [mustDeps] — an ordered dependency.
 * @property {(DepsChunk|Array<DepsChunk>)} [shouldDeps] — an unordered dependency.
 */

/**
 * @typedef {Object} DepsLink
 * @property {BemCell} vertex — An entity, that depends on the entity from the `dependOn` field.
 * @property {BemCell} dependOn — An entity from which the `vertex` entity depends on.
 * @property {boolean} [ordered] - `mustDeps` dependency if `true`.
 * @property {string} [path] - path to deps.js file if exists.
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
 * A BEM-entity with or without a tech
 * @typedef {entity: BemEntityName, tech: ?String} Vertex
 */

/**
 * @typedef {Object} DepsLink
 * @property {BemCell} vertex
 * @property {BemCell} dependOn
 * @property {boolean} [ordered] - `mustDeps` if set to true
 * @property {string} [path] - path to deps.js file if exists
 */

/**
 * @param {Array<DepsLink>} deps - List of dependencies.
 * @param {Object} options — an options used to create a graph.
 * @param {Boolean} denaturalized — if `true` the created graph won't be naturalized.
 * @returns {BemGraph} — a created graph of dependencies.
 */
buildGraph(deps, options)
```

## License

© 2019 [Yandex](https://yandex.com/company/). Code released under [Mozilla Public License 2.0](LICENSE.txt).


[cell-package]: https://github.com/bem/bem-sdk/tree/master/packages/cell
[file-package]: https://github.com/bem/bem-sdk/tree/master/packages/file
[graph-package]: https://github.com/bem/bem-sdk/tree/master/packages/graph
[walk-package]: https://github.com/bem/bem-sdk/tree/master/packages/walk
[config-package]: https://github.com/bem/bem-sdk/tree/master/packages/config
