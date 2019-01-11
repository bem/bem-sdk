# graph

The graph of dependencies for BEM entities.

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.org/package/@bem/sdk.graph
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.graph.svg

* [Introduction](#introduction)
* [Try graph](#try-graph)
* [Quickstart](#quickstart)
* [API Reference](#api-reference)
* [Parameters tuning](#parameters-tuning)
* [Usage examples](#usage-examples)

## Introduction

Graph allows you create an ordered dependencies list for the specified BEM entities and technologies.

## Try graph

An example is available in the [RunKit editor](https://runkit.com/migs911/how-bem-sdk-graph-works).

## Quickstart

> **Attention.** To use `@bem/sdk.graph`, you must install [Node.js 8.0+](https://nodejs.org/en/download/).

To run the `@bem/sdk.graph` package:

1. [Install `@bem/sdk.graph` package](#installing-bemsdkgraph-package)
2. [Create an empty graph](#creating-an-empty-graph)
3. [Create vertices](#creating-vertices)
4. [Set dependencies by using the `dependsOn()` function](#setting-dependencies-by-using-the-dependson-function)
5. [Get the dependencies of a block](#getting-the-dependencies-of-a-block)
6. [Set dependencies using the `linkWith()` function](#setting-dependencies-using-the-linkwith-function)

### Installing `@bem/sdk.graph` package

To install the `@bem/sdk.graph` package, run the following command:

```
$ npm install --save @bem/sdk.graph
```

### Creating an empty graph

Create a JavaScript file with any name (for example, **app.js**) and insert the following:

```js
const { BemGraph } = require('@bem/sdk.graph');
const graph = new BemGraph();
```

> **Note.** Use the same file for all of the following steps.

### Creating vertices

Create a new vertices for the blocks `a` and `b`:

```js
graph.vertex({ block: 'a'});

graph.vertex({ block: 'b'});
```

### Setting dependencies by using the `dependsOn()` function

Let the block `a` depends on the block `b`. It means that the block `b` has some code that **must be imported before** the block `a` code.

And let the block `b` depends on the block `c`:

```js
graph.vertex({ block: 'a'})
    .dependsOn({ block: 'b'});

graph.vertex({ block: 'b'})
    .dependsOn({ block: 'c'});
```

> If you are familiar with the [@bem/sdk.deps](https://github.com/bem/bem-sdk/tree/master/packages/deps) package, the `dependsOn()` adds the `mustDeps` link.

### Getting the dependencies of a block

So the block `a` depends on the `b` and the block `b` depends on the `c`. If we want to compile the block `a`, we need to import the code of the block `c` first, then import the code of the block `b` and only then use the code of the block `a`.

The `dependenciesOf()` function will return entities names to us in the right order:

```js
graph.dependenciesOf({ block: 'a'})
// => [
//     { 'entity': { 'block': 'c'}},
//     { 'entity': { 'block': 'b'}},
//     { 'entity': { 'block': 'a'}}
// ]
```

### Setting dependencies using the `linkWith()` function

Let the block `b` also depends on the block `d`, but it doesn't matter when the code from the block `d` is imported, before the block `b` or after.

Change the code to set this dependency for the block `b` vertex.

**app.js:**

```js
const { BemGraph } = require('@bem/sdk.graph');
const graph = new BemGraph();

graph.vertex({ block: 'a'})
    .dependsOn({ block: 'b'});

graph.vertex({ block: 'b'})
    .dependsOn({ block: 'c'})
    .linkWith({ block: 'd'});

graph.dependenciesOf({ block: 'a'})
// => [
//     { 'entity': { 'block': 'c'}},
//     { 'entity': { 'block': 'b'}},
//     { 'entity': { 'block': 'a'}},
//     { 'entity': { 'block': 'd'}}
// ]
```

In the dependencies list the block `d` will be added to any position randomly.

> If you are familiar with the [@bem/sdk.deps](https://github.com/bem/bem-sdk/tree/master/packages/deps) package, the `linkWith()` adds the `shouldDeps` link.

[RunKit live example](https://runkit.com/migs911/graph-quick-start).

## API Reference

* [BemGraph.vertex()](#bemgraphvertex)
* [BemGraph.Vertex.linkWith()](#bemgraphvertexlinkwith)
* [BemGraph.Vertex.dependsOn()](#bemgraphvertexdependson)
* [BemGraph.dependenciesOf()](#bemgraphdependenciesof)
* [BemGraph.naturalize()](#bemgraphnaturalize)

### BemGraph.vertex()

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
 * Registers a new vertex for the specified BEM entity and technology.
 *
 * @param {BemEntityName} entity — Representation of the BEM entity name.
 * @param {string} [tech] — Tech of the BEM entity.
 * @returns {BemGraph.Vertex} — A created vertex with methods that allow you to link it with other vertices.
 */
BemGraph.vertex(entity, tech)
```

**Example:**

```js
const { BemGraph } = require('@bem/sdk.graph');
const graph = new BemGraph();

graph.vertex({ block: 'my-block', elem: 'my-element', mod: 'my-modifier'}, 'css');
```

### BemGraph.Vertex.linkWith()

```js
/**
 * Creates an unordered link between contained and passed vertices.
 *
 * @param {BemEntityName} entity — Representation of the BEM entity name.
 * @param {string} [tech] — Tech of the BEM entity.
 */
BemGraph.Vertex.linkWith(entity, tech)
```

**Example:**

```js
const { BemGraph } = require('@bem/sdk.graph');
const graph = new BemGraph();

graph.vertex({ block: 'a'})
    .linkWith({ block: 'b'});
```

### BemGraph.Vertex.dependsOn()

```js
/**
 * Creates an ordered link between contained and passed vertices.
 *
 * @param {BemEntityName} entity — Representation of the BEM entity name.
 * @param {string} [tech] — Tech of the BEM entity.
 */
BemGraph.Vertex.dependsOn(entity, tech)
```

**Example:**

```js
const { BemGraph } = require('@bem/sdk.graph');
const graph = new BemGraph();

graph.vertex({ block: 'a'})
    .dependsOn({ block: 'b'});
```

### BemGraph.dependenciesOf()

```js
/**
 * Create an ordered list of the entities and technologies.
 *
 * @param {Object|Array} cells — one or more objects to create a BEM cells for them and get the dependencies list for.
 * @param {string} cells.block — Block name.
 * @param {string} cells.elem — Element name
 * @param {string|object} cells.mod — Modifier name or object with name and value.
 * @param {string} cells.mod.name — Modifier name.
 * @param {string} cells.mod.val — Modifier value.
 * @param {string} cells.tech — Tech of cell.
 * @return {Array} — an ordered list of the entities and technologies.
 */
BemGraph.dependenciesOf(cells)
```

For each object passed in the `cells` parameter, a new `BemCell` object will be created using the [create()](https://github.com/bem/bem-sdk/tree/master/packages/cell#createobject) function from the `@bem/sdk.cell` package.

**Example:**

```js
const { BemGraph } = require('@bem/sdk.graph');
const graph = new BemGraph();

graph.vertex({ block: 'a'})
    .dependsOn({ block: 'b'});

graph.dependenciesOf();
```

### BemGraph.naturalize()

```js
/**
 * Creates "natural" links between registered vertices:
 * - element should depend on block;
 * - block modifier should depend on block;
 * - element modifier should depend on element.
 */
BemGraph.naturalize()
```

See an example of using this function in the [Naturalize graph](#naturalize-graph) section.

## Parameters tuning

* [Specify a technology for the created vertex](#specify-a-technology-for-the-created-vertex)
* [Specify a technology for the dependency](#specify-a-technology-for-the-dependency)
* [Naturalize graph](#naturalize-graph)
* [Get dependencies for the list of cells](#get-dependencies-for-the-list-of-cells)

### Specify a technology for the created vertex

When you create a new vertex you can specify the technology.

```js
graph.vertex({ block: 'a'})
    .dependsOn({ block: 'b'});

graph.vertex({ block: 'a'}, 'css')
    .dependsOn({ block: 'c'});
```

This code means that only the block `a` with technology CSS depends on the block `c`. If you get the dependencies list for the block `a` with another technology or without any technology, the block `c` will not be in this list.

```js
const { BemGraph } = require('@bem/sdk.graph');
const graph = new BemGraph();

graph.vertex({ block: 'a'})
    .dependsOn({ block: 'b'});

graph.vertex({ block: 'a'}, 'css')
    .dependsOn({ block: 'c'});

graph.dependenciesOf({ block: 'a'});
// => [
//     { 'entity': { 'block': 'b'}},
//     { 'entity': { 'block': 'a'}},
// ]

graph.dependenciesOf({ block: 'a'}, 'js');
// => [
//     { 'entity': { 'block': 'b'}, 'tech': 'js'},
//     { 'entity': { 'block': 'a'}, 'tech': 'js'}
// ]

graph.dependenciesOf({ block: 'a'}, 'css');
// => [
//     { 'entity': { 'block': 'c'}, 'tech': 'css'},
//     { 'entity': { 'block': 'b'}, 'tech': 'css'},
//     { 'entity': { 'block': 'a'}, 'tech': 'css'}
// ]
```

[RunKit live example](https://runkit.com/migs911/graph-specify-a-technology-for-the-created-vertex).

### Specify a technology for the dependency

When you set a dependency for the created vertex you can specify the technology.

```js
graph.vertex({ block: 'a'})
    .dependsOn({ block: 'b'}, 'js');

graph.vertex({ block: 'b'}, 'css')
    .dependsOn({ block: 'common-css'});

graph.vertex({ block: 'b'}, 'js')
    .dependsOn({ block: 'common-js'});
```

This code means that the block `a` depends on the block `b` with the `js` technology. So in dependencies list for the block `a` will be the block `common-js`, but  will not be the `common-css` block.

```js
const { BemGraph } = require('@bem/sdk.graph');
const graph = new BemGraph();

graph.vertex({ block: 'a'})
    .dependsOn({ block: 'b'}, 'js');

graph.vertex({ block: 'b'}, 'css')
    .dependsOn({ block: 'common-css'});

graph.vertex({ block: 'b'}, 'js')
    .dependsOn({ block: 'common-js'});

graph.dependenciesOf({ block: 'a'});
// => [
//     { 'entity': { 'block': 'common-js'}, 'tech': 'js'},
//     { 'entity': { 'block': 'b'}, 'tech': 'js'},
//     { 'entity': { 'block': 'a'}}
// ]
```

[RunKit live example](https://runkit.com/migs911/graph-specify-a-technology-for-the-dependency).

### Naturalize graph

Let you create a new vertex for the blocks `a` and `b` and set the block `a` depends on the block element `b__el`.

```js
const { BemGraph } = require('@bem/sdk.graph');
const graph = new BemGraph();

graph.vertex({ block: 'a'})
    .dependsOn({ block: 'b', elem: 'el'});

graph.vertex({ block: 'b'});

graph.dependenciesOf({block: 'a'});
// => [
//     { 'entity': { 'block': 'b', elem: 'el'}},
//     { 'entity': { 'block': 'a'}}
// ]

graph.naturalize();
graph.dependenciesOf({block: 'a'});
// => [
//     { 'entity': { 'block': 'b'}},
//     { 'entity': { 'block': 'b', elem: 'el'}},
//     { 'entity': { 'block': 'a'}}
// ]
```

In this code calling the `graph.naturalize()` function is equal to the following code:

```js
graph.vertex({ block: 'b', elem: `el` })
    .dependsOn({ block: 'b'});
```

[RunKit live example](https://runkit.com/migs911/graph-naturalize-graph).

### Get dependencies for the list of cells

You can get the dependencies list for multiple cells. To do it create an array of cells and pass this array into the `dependenciesOf()` function.

```js
const { BemGraph } = require('@bem/sdk.graph');
const graph = new BemGraph();

graph.vertex({ block: 'a'})
    .linkWith({ block: 'b'});

graph.vertex({ block: 'c'}, 'js')
    .dependsOn({ block: 'd'});

const cells  = [
    { block: 'a'},
    { block: 'c', tech: 'js'}
]

// Create a BEM cell for each object in the `cells` array and get the dependencies list for these objects.
graph.dependenciesOf(cells);
// => [
//     { 'entity': { 'block': 'a'}},
//     { 'entity': { 'block': 'd'}},
//     { 'entity': { 'block': 'c'}}
//     { 'entity': { 'block': 'b'}}
// ]
```

[RunKit live example](https://runkit.com/migs911/graph-get-a-dependencies-for-the-list-of-cells).

## Usage examples

### Create a Header dependencies list

In the BEM methodology, we have seen [an example of a typical Header](https://en.bem.info/methodology/key-concepts/#block-features).

![](header_example.png)

Let create a graph and get the dependencies list for the Head block from this example.

```js
const { BemGraph } = require('@bem/sdk.graph');
const BemCell = require('@bem/sdk.cell');
const graph = new BemGraph();

graph.vertex({ block: 'head'})
    .dependsOn({ block: 'menu'})
    .dependsOn({ block: 'logo'})
    .dependsOn({ block: 'search'})
    .dependsOn({ block: 'auth'});

graph.vertex({ block: 'search'})
    .dependsOn({ block: 'input', mod: 'search-input'})
    .dependsOn({ block: 'button', mod: 'search-button'});

graph.vertex({ block: 'menu'})
    .dependsOn({ block: 'tab', elem: 'tab1'})
    .dependsOn({ block: 'tab', elem: 'tab2'})
    .dependsOn({ block: 'tab', elem: 'tab3'})
    .dependsOn({ block: 'tab', elem: 'tab4'});

graph.vertex({ block: 'auth'})
    .dependsOn({ block: 'input', elem: 'login'})
    .dependsOn({ block: 'input', elem: 'password'})
    .dependsOn({ block: 'button', mod: 'sign-in'});

// Register remaining vertices to naturalize the graph.
graph.vertex({ block: 'input'});
graph.vertex({ block: 'button'});
graph.vertex({ block: 'tab'});
graph.naturalize();

graph.dependenciesOf({ block: 'head'}).map(c => BemCell.create(c).id).join('\n');
// => tab
// tab__tab1
// tab__tab2
// tab__tab3
// tab__tab4
// menu
// logo
// input
// input_search-input
// button
// button_search-button
// search
// input__login
// input__password
// button_sign-in
// auth
// head
```

[RunKit live example](https://runkit.com/migs911/graph-create-a-header-dependencies-list).