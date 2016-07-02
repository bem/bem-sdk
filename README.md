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

License
-------

Code and documentation copyright 2016 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
