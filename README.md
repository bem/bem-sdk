bem-entity-name
===============

[![NPM Status][npm-img]][npm]
[![Travis Status][test-img]][travis]
[![Coverage Status][coverage-img]][coveralls]
[![Dependency Status][dependency-img]][david]

[npm]:          https://www.npmjs.org/package/@bem/entity-name
[npm-img]:      https://img.shields.io/npm/v/@bem/entity-name.svg

[travis]:       https://travis-ci.org/bem-sdk/bem-entity-name
[test-img]:     https://img.shields.io/travis/bem-sdk/bem-entity-name.svg

[coveralls]:    https://coveralls.io/r/bem-sdk/bem-entity-name
[coverage-img]: https://img.shields.io/coveralls/bem-sdk/bem-entity-name.svg

[david]:          https://david-dm.org/bem-sdk/bem-entity-name
[dependency-img]: http://img.shields.io/david/bem-sdk/bem-entity-name.svg

BEM entity name representation.

Install
-------

```
$ npm install --save @bem/entity-name
```

Usage
-----

```js
const BemEntityName = require('@bem/entity-name');

const entityName = new BemEntityName({ block: 'button', elem: 'text' });

entityName.block; // button
entityName.elem;  // text
entityName.mod;   // undefined

entityName.id;   // button__elem
entityName.type; // elem

entityName.isEqual({ block: 'button' });               // false
entityName.isEqual({ block: 'button', elem: 'text' }); // true
```

BEM Entity Name
---------------

BEM entities can be defined with a help of JS object with the following fields:

* `block` — a block name. The field is required because only a block exists as an independent BEM entity
* `elem` — an element name.
* `mod` —  a modifier.

The modifier consists of a pair of fields `mod.name` and `mod.val`. This means that the field `mod.val` without `mod.name` has no meaning.

**Example:**

```js
const BemEntityName = require('@bem/entity-name');

// The modifier of block
new BemEntityName({
    block: 'button',
    mod: { name 'view', val: 'action' }
});

// Not valid modifier
new BemEntityName({
    block: 'block',
    mod: { val: 'action' }
});
```

To describe the simple modifier field `mod.val` must be specified as `true`.

**Example:**

```js
// Boolean modifier of a block
new BemEntityName({
    block: 'button',
    mod: { name: 'focused', val: true }
});

// Shorthand for the boolean modifier of a block
new BemEntityName({
    block: 'button',
    mod: 'focused'
});
```

API
---

* [constructor(obj)](#constructorobj)
* [block](#block)
* [elem](#elem)
* [mod](#mod)
* [id](#id)
* [type](#type)
* [isEqual(entityName)](#isequalentityname)
* [toString()](#tostring)
* [valueOf()](#valueof)
* [isBemEntityName()](#isbementityname)

### constructor(obj)

Parameter     | Type     | Description
--------------|----------|------------------------------
`obj.block`   | `string` | The block name of entity.
`obj.elem`    | `string` | The element name of entity.
`obj.mod`     | `string`, `object` | The modifier of entity.<br><br> If specified value is `string` then it will be equivalent to `{ name: string, val: true }`.
`obj.mod.name`| `string` | The modifier name of entity.
`obj.mod.val` | `*`      | The modifier value of entity.

### block

The name of block to which this entity belongs.

```js
const BemEntityName = require('@bem/entity-name');
const name = new BemEntityName({ block: 'button' });

name.block; // button
```

### elem

The element name of this entity.

If entity is not element or modifier of element then returns empty string.

```js
const BemEntityName = require('@bem/entity-name');
const name = new BemEntityName({ block: 'button', elem: 'text' });

name.elem; // text
```

### mod

The modifier of this entity.

**Important:** If entity is not a modifier then returns `undefined`.

```js
const BemEntityName = require('@bem/entity-name');

const blockName = new BemEntityName({ block: 'button' });
const modName = new BemEntityName({ block: 'button', mod: 'disabled' });

modName.mod;   // { name: 'disabled', val: true }
blockName.mod; // undefined
```

### id

The id for this entity.

**Important:** should only be used to determine uniqueness of entity.

If you want to get string representation in accordance with the provisions naming convention you should use [bem-naming](https://github.com/bem-sdk/bem-naming) package.

```js
const BemEntityName = require('@bem/entity-name');
const name = new BemEntityName({ block: 'button', mod: 'disabled' });

name.id; // button_disabled
```

### type

The type for this entity.

Possible values: `block`, `elem`, `blockMod`, `elemMod`.

```js
const BemEntityName = require('@bem/entity-name');

const elemName = new BemEntityName({ block: 'button', elem: 'text' });
const modName = new BemEntityName({ block: 'menu', elem: 'item', mod: 'current' });

elemName.type; // elem
modName.type;  // elemMod
```

### isEqual(entityName)

Parameter    | Type            | Description
-------------|-----------------|-----------------------
`entityName` | `BemEntityName` | The entity to compare.

Determines whether specified entity is the deepEqual entity.

```js
const BemEntityName = require('@bem/entity-name');

const inputName = new BemEntityName({ block: 'input' });
const buttonName = new BemEntityName({ block: 'button' });

inputName.isEqual(buttonName);  // false
buttonName.isEqual(buttonName); // true
```

### toString()

Returns string representing the entity name.

**Important:** if you want to get string representation in accordance with the provisions naming convention
you should use [bem-naming](https://github.com/bem-sdk/bem-naming) package.

```js
const BemEntityName = require('@bem/entity-name');
const name = new BemEntityName({ block: 'button', mod: 'focused' });

name.toString(); // button_focused
```

### valueOf()

Returns object representing the entity name.

```js
const BemEntityName = require('@bem/entity-name');
const name = new BemEntityName({ block: 'button', mod: 'focused' });

name.valueOf();

// ➜ { block: 'button', mod: { name: 'focused', value: true } }
```

### isBemEntityName()

Determines whether specified entity is instance of BemEntityName.

Parameter    | Type            | Description
-------------|-----------------|-----------------------
`entityName` | `BemEntityName` | The entity to check.

```js
const BemEntityName = require('@bem/entity-name');

const entityName = new BemEntityName({ block: 'input' });

BemEntityName.isBemEntityName(entityName); // true
BemEntityName.isBemEntityName({}); // false
```

Debuggability
-------------

In Node.js, `console.log()` calls `util.inspect()` on each argument without a formatting placeholder.

`BemEntityName` has `inspect()` method to get custom string representation of the object.

```js
const BemEntityName = require('@bem/entity-name');

const name = new BemEntityName({ block: 'input', mod: 'available' });

console.log(name);

// ➜ BemEntityName { block: 'input', mod: { name: 'available' } }
```

You can also convert `BemEntityName` object to `string`.

```js
const BemEntityName = require('@bem/entity-name');

const name = new BemEntityName({ block: 'input', mod: 'available' });

console.log(`name: ${name}`);

// ➜ name: input_available
```

License
-------

Code and documentation © 2016 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
