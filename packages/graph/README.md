bem-graph
=========

[![NPM Status][npm-img]][npm]
[![Travis Status][test-img]][travis]
[![Coverage Status][coverage-img]][coveralls]
[![Dependency Status][david-img]][david]

[npm]:          https://www.npmjs.org/package/bem-graph
[npm-img]:      https://img.shields.io/npm/v/bem-graph.svg

[travis]:       https://travis-ci.org/bem-sdk/bem-graph
[test-img]:     https://img.shields.io/travis/bem-sdk/bem-graph.svg?label=tests

[coveralls]:    https://coveralls.io/r/bem-sdk/bem-graph
[coverage-img]: https://img.shields.io/coveralls/bem-sdk/bem-graph.svg

[david]:        https://david-dm.org/bem-sdk/bem-graph
[david-img]:    http://img.shields.io/david/bem-sdk/bem-graph.svg?style=flat

Install
-------

```
$ npm install --save-dev bem-graph
```

Usage
-----

```js
const BemGraph = require('bem-graph');

const graph = new BemGraph();

graph.vertex({ block: 'attach' }, 'js')
    .dependsOn({ block: 'button' }, 'bemhtml');

graph.vertex({ block: 'button' })
    .linkWith({ block: 'button', elem: 'text' });

graph.vertex({ block: 'textarea' }, 'css')
    .dependsOn({ block: 'input' }, 'css');

const decl = [
    { block: 'attach' },
    { block: 'textarea' },
    { block: 'button' }
];

graph.dependenciesOf(decl, 'css');
// [
//     { entity: { block: 'attach' }, tech: 'css' },
//     { entity: { block: 'textarea' }, tech: 'css' },
//     { entity: { block: 'input' }, tech: 'css' },
//     { entity: { block: 'button' }, tech: 'css' },
//     { entity: { block: 'button', elem: 'text' }, tech: 'css' }
// ]

graph.dependenciesOf(decl, 'js');
// [
//     { entity: { block: 'button' }, tech: 'bemhtml' },
//     { entity: { block: 'attach' }, tech: 'js' },
//     { entity: { block: 'button', elem: 'text' }, tech: 'bemhtml' },
//     { entity: { block: 'textarea' }, tech: 'js' }
// ]
```

API
---

BemGraph based on [BemEntityName][] objects and [bem-decl][] format.

[BemEntityName]: https://github.com/bem-sdk/bem-entity-name
[bem-decl]: https://github.com/bem-sdk/bem-decl

### `BemGraph.vertex`

```js
BemGraph.vertex(entityName: BemEntityName, tech: String): BemGraph~Vertex
```

Registers vertex in graph and makes a helper object `BemGraph~Vertex` with methods
to link it with other vertices.

### `BemGraph.dependenciesOf`

```js
BemGraph.dependenciesOf(declaration: Array<BemEntityName>, tech: String):
    Array<{entity: BemEntityName, tech: String}>
```

Resolves ordered declaration and returns .

NB: Will throw for cycles in ordered links.

### `BemGraph.naturalize`

```js
BemGraph.naturalize(): void
```

Creates "natural" links between registered entities:
- element should depend on block;
- block modifier should also depend on block;
- element modifier should depend on element.

### `BemGraph~Vertex.dependsOn`

```js
Vertex.dependsOn(entityName: BemEntityName, tech: String): BemGraph~Vertex
```

Creates an ordered link between contained and passed vertices.

### `BemGraph~Vertex.linkWith`

```js
Vertex.linkWith(entityName: BemEntityName, tech: String): BemGraph~Vertex
```

Creates an unordered link between contained and passed vertices.

License
-------

Code and documentation copyright 2016 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
