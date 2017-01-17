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

API
---

* [constructor(obj)](#constructorobj)
* [entity](#entity)
* [tech](#tech)
* [layer](#layer)
* [id](#id)
* [isBemCell(cell)](#isbemcellcell)

### constructor(obj)

Parameter     | Type            | Description
--------------|-----------------|------------------------------
`obj.entity`  | `BemEntityName` | Representation of entity name
`obj.tech`    | `string`        | Tech of cell
`obj.layer`   | `string`        | Layer of cell

### entity

Returns the name of entity.

```js
const BemCell = require('@bem/cell');
const BemEntityName = require('@bem/entity-name');

const cell = new BemCell({
    entity: new BemEntityName({ block: 'button', elem: 'text' })
});

cell.entity; // ➜ BemEntityName { block: 'button', elem: 'text' }
```

### tech

Returns the tech of cell.

```js
const BemCell = require('@bem/cell');
const BemEntityName = require('@bem/entity-name');

const cell = new BemCell({
    entity: new BemEntityName({ block: 'button', elem: 'text' }),
    tech: 'css'
});

cell.tech; // ➜ css
```

### layer

Returns the layer of this cell.

 ```js
const BemCell = require('@bem/cell');
const BemEntityName = require('@bem/entity-name');

const cell = new BemCell({
    entity: new BemEntityName({ block: 'button', elem: 'text' }),
    layer: 'desktop'
});

cell.layer; // ➜ desktop
```

### id

Returns the identifier of this cell.

**Important:** should only be used to determine uniqueness of cell.

```js
const BemCell = require('@bem/cell');
const BemEntityName = require('@bem/entity-name');

const cell = new BemCell({
    entity: new BemEntityName({ block: 'button', elem: 'text' }),
    tech: 'css',
    layer: 'desktop'
});

cell.id; // ➜ "button__text@desktop.css"
```

### isBemCell(cell)

Determines whether specified cell is instance of BemCell.

Parameter | Type            | Description
----------|-----------------|-----------------------
`cell`    | `BemCell`       | The cell to check.

```js
const BemCell = require('@bem/cell');
const BemEntityName = require('@bem/entity-name');

const cell = new BemCell({
    entity: new BemEntityName({ block: 'button', elem: 'text' })
});

BemCell.isBemCell(cell); // true
BemCell.isBemCell({}); // false
```

License
-------

Code and documentation © 2016 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
