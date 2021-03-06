# BemCell

Representation of identifier of a part of [BEM entity](https://en.bem.info/methodology/key-concepts/#bem-entity).

BEM Cell consists of the [BEM entity name][entity-name], technology and layer.

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.org/package/@bem/sdk.cell
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.cell.svg


## Install

```sh
$ npm install --save @bem/sdk.cell
```

## Usage

```js
const BemCell = require('@bem/sdk.cell');
const BemEntityName = require('@bem/sdk.entity-name');

const cell = new BemCell({
    entity: new BemEntityName({ block: 'button', elem: 'text', mod: { name: 'theme', val: 'simple' } }),
    tech: 'css',
    layer: 'common'
});

cell.entity; // ➜ BemEntityName { block: 'button', elem: 'text' }
cell.tech;   // css
cell.layer;  // common
cell.id;     // button__text@common.css

cell.block;  // → button
cell.elem;   // → text
cell.mod;    // → { name: 'theme', val: 'simple' }
```

## API

* [constructor(obj)](#constructorobj)
* [entity](#entity)
* [tech](#tech)
* [layer](#layer)
* [id](#id)
* [toString()](#tostring)
* [valueOf()](#valueof)
* [toJSON()](#tojson)
* [isEqual(cell)](#isequalcell)
* [isBemCell(cell)](#isbemcellcell)
* [create(object)](#createobject)

### constructor(obj)

Parameter     | Type            | Description
--------------|-----------------|------------------------------
`obj.entity`  | `BemEntityName` | Representation of [BEM entity name][entity-name]
`obj.tech`    | `string`        | Tech of cell
`obj.layer`   | `string`        | Layer of cell

### entity

Returns the [BEM entity name][entity-name] of this cell.

```js
const BemCell = require('@bem/sdk.cell');
const BemEntityName = require('@bem/sdk.entity-name');

const cell = new BemCell({
    entity: new BemEntityName({ block: 'button', elem: 'text' })
});

cell.entity; // ➜ BemEntityName { block: 'button', elem: 'text' }
```

### tech

Returns the tech of this cell.

```js
const BemCell = require('@bem/sdk.cell');
const BemEntityName = require('@bem/sdk.entity-name');

const cell = new BemCell({
    entity: new BemEntityName({ block: 'button', elem: 'text' }),
    tech: 'css'
});

cell.tech; // ➜ css
```

### layer

Returns the layer of this cell.

 ```js
const BemCell = require('@bem/sdk.cell');
const BemEntityName = require('@bem/sdk.entity-name');

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
const BemCell = require('@bem/sdk.cell');
const BemEntityName = require('@bem/sdk.entity-name');

const cell = new BemCell({
    entity: new BemEntityName({ block: 'button', elem: 'text' }),
    tech: 'css',
    layer: 'desktop'
});

cell.id; // ➜ "button__text@desktop.css"
```

### toString()

Returns a string representing this cell.

```js
const BemCell = require('@bem/sdk.cell');
const BemEntityName = require('@bem/sdk.entity-name');
const cell = new BemCell({
    entity: new BemEntityName({ block: 'button', mod: 'focused' }),
    tech: 'css',
    layer: 'desktop'
});

cell.toString(); // button_focused@desktop.css
```

### valueOf()

Returns an object representing this cell.

```js
const BemCell = require('@bem/sdk.cell');
const BemEntityName = require('@bem/sdk.entity-name');
const cell = new BemCell({
    entity: new BemEntityName({ block: 'button', mod: 'focused' }),
    tech: 'css',
    layer: 'desktop'
});

cell.valueOf();

// ➜ { entity: { block: 'button', mod: { name: 'focused', value: true } }, tech: 'css', layer: 'desktop' }
```

### toJSON()

Returns an object for `JSON.stringify()` purpose.

### isEqual(cell)

Determines whether specified cell is deep equal to cell or not.

Parameter | Type            | Description
----------|-----------------|-----------------------
`cell`    | `BemCell`       | The cell to compare.

```js
const BemCell = require('@bem/sdk.cell');
const buttonCell1 = BemCell.create({ block: 'button', tech: 'css', layer: 'desktop' });
const buttonCell2 = BemCell.create({ block: 'button', tech: 'css', layer: 'desktop' });
const inputCell = BemCell.create({ block: 'input', tech: 'css', layer: 'common' });

buttonCell1.isEqual(buttonCell2); // true
buttonCell1.isEqual(inputCell); // false
```

### #isBemCell(cell)

Determines whether specified cell is instance of BemCell.

Parameter | Type            | Description
----------|-----------------|-----------------------
`cell`    | `BemCell`       | The cell to check.

```js
const BemCell = require('@bem/sdk.cell');
const BemEntityName = require('@bem/sdk.entity-name');

const cell = new BemCell({
    entity: new BemEntityName({ block: 'button', elem: 'text' })
});

BemCell.isBemCell(cell); // true
BemCell.isBemCell({}); // false
```

### #create(object)

Creates BemCell instance by any object representation.

Helper for sugar-free simplicity.

Parameter    | Type     | Description
-------------|----------|--------------------------
`object`     | `object` | Representation of entity name.

Passed Object could have fields for BemEntityName and cell itself:

Object field | Type     | Description
-------------|----------|------------------------------
`block`      | `string` | The block name of entity.
`elem`       | `string` | The element name of entity.
`mod`        | `string`, `object` | The modifier of entity.<br><br> If specified value is `string` then it will be equivalent to `{ name: string, val: true }`.
`val`        | `string` | The modifier value of entity. Used if `mod` is a string.
`mod.name`   | `string` | The modifier name of entity.
`mod.val`    | `*`      | The modifier value of entity.
`modName`    | `string` | The modifier name of entity. Used if `mod.name` wasn't specified. **Deprecated**
`modVal`     | `*`      | The modifier value of entity. Used if neither `mod.val` nor `val` were not specified. **Deprecated**
`tech`       | `string` | Technology of cell.
`layer`      | `string` | Layer of cell.

```js
const BemCell = require('@bem/sdk.cell');

BemCell.create({ block: 'my-button', mod: 'theme', val: 'red', tech: 'css', layer: 'common' });
BemCell.create({ block: 'my-button', modName: 'theme', modVal: 'red', tech: 'css', layer: 'common' });
BemCell.create({ entity: { block: 'my-button', modName: 'theme', modVal: 'red' }, tech: 'css' }); // valueOf() format
// → BemCell { entity: { block: 'my-button', mod: { name: 'theme', val: 'red' } }, tech: 'css', layer: 'common' }
```

## Debuggability

In Node.js, `console.log()` calls `util.inspect()` on each argument without a formatting placeholder.

`BemCell` has `inspect()` method to get custom string representation of the object.

```js
const BemCell = require('@bem/sdk.cell');
const BemEntityName = require('@bem/sdk.entity-name');

const cell = new BemCell({
    entity: new BemEntityName({ block: 'input', mod: 'available' }),
    tech: 'css'
});

console.log(cell);

// ➜ BemCell { entity: { block: 'input', mod: { name: 'available' } }, tech: 'css' }
```

You can also convert `BemCell` object to a `string`.

```js
const BemCell = require('@bem/sdk.cell');
const BemEntityName = require('@bem/sdk.entity-name');

const cell = new BemCell({
    entity: new BemEntityName({ block: 'input', mod: 'available' }),
    tech: 'css'
});

console.log(`cell: ${cell}`);

// ➜ cell: input_available.css
```

Also `BemCell` has `toJSON` method to support `JSON.stringify()` behaviour.

```js
const BemCell = require('@bem/sdk.cell');
const BemEntityName = require('@bem/sdk.entity-name');

const cell = new BemCell({
    entity: new BemEntityName({ block: 'input', mod: 'available' }),
    tech: 'css'
});

console.log(JSON.stringify(cell));

// ➜ {"entity":{"block":"input","mod":{"name":"available","val":true}},"tech":"css"}
```

## Deprecation

Deprecation is performed with [depd](https://github.com/dougwilson/nodejs-depd)
To silencing deprecation warnings from being output simply use this. [Details](https://github.com/dougwilson/nodejs-depd#processenvno_deprecation)
```
NO_DEPRECATION=@bem/sdk.cell node app.js
```

## License

© 2019 [YANDEX LLC](https://yandex.com/company/). Code released under [Mozilla Public License 2.0](LICENSE.txt).


<!-- References list -->
[entity-name]: https://github.com/bem/bem-sdk/tree/master/packages/entity-name
