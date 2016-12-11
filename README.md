BemCell
=======

[![NPM Status][npm-img]][npm]
[![Travis Status][test-img]][travis]
[![Coverage Status][coverage-img]][coveralls]
[![Dependency Status][dependency-img]][david]

[npm]:          https://www.npmjs.org/package/@bem/cell
[npm-img]:      https://img.shields.io/npm/v/@bem/cell.svg

[travis]:       https://travis-ci.org/bem-sdk/bem-cell
[test-img]:     https://img.shields.io/travis/bem-sdk/bem-cell.svg

[coveralls]:    https://coveralls.io/r/bem-sdk/bem-cell
[coverage-img]: https://img.shields.io/coveralls/bem-sdk/bem-cell.svg

[david]:          https://david-dm.org/bem-sdk/bem-cell
[dependency-img]: http://img.shields.io/david/bem-sdk/bem-cell.svg

Representation of identifier of a part of [BEM entity](https://en.bem.info/methodology/key-concepts/#bem-entity).

Install
-------

```
$ npm install --save @bem/cell
```

Usage
-----

```js
const BemCell = require('@bem/cell');
const BemEntityName = require('@bem/entity-name');

const cell = new BemCell({
    entity: new BemEntityName({ block: 'button', elem: 'text' }),
    tech: 'css',
    layer: 'common'
});

cell.entity; // ➜ BemEntityName { block: 'button', elem: 'text' }
cell.tech;   // css
cell.layer;  // common
cell.id;     // button__text@common.css
```

License
-------

Code and documentation © 2016 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
