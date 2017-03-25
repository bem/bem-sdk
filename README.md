BemEntityName
=============

[BEM entity](https://en.bem.info/methodology/key-concepts/#bem-entity) name representation.

[![NPM Status][npm-img]][npm]
[![Travis Status][test-img]][travis]
[![Coverage Status][coverage-img]][coveralls]
[![Dependency Status][dependency-img]][david]

[npm]:          https://www.npmjs.org/package/@bem/entity-name
[npm-img]:      https://img.shields.io/npm/v/@bem/entity-name.svg

[travis]:       https://travis-ci.org/bem-sdk/bem-entity-name
[test-img]:     https://img.shields.io/travis/bem-sdk/bem-entity-name/master.svg

[coveralls]:    https://coveralls.io/r/bem-sdk/bem-entity-name
[coverage-img]: https://img.shields.io/coveralls/bem-sdk/bem-entity-name/master.svg

[david]:          https://david-dm.org/bem-sdk/bem-entity-name
[dependency-img]: http://img.shields.io/david/bem-sdk/bem-entity-name.svg

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

entityName.isEqual(new BemEntityName({ block: 'button' }));               // false
entityName.isEqual(new BemEntityName({ block: 'button', elem: 'text' })); // true
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

To describe the simple modifier, field `mod.val` must be specified as `true`.

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

* [constructor({ block, elem, mod })](#constructor-block-elem-mod-)
* [block](#block)
* [elem](#elem)
* [mod](#mod)
* [id](#id)
* [type](#type)
* [isSimpleMod()](#issimplemod)
* [isEqual(entityName)](#isequalentityname)
* [toString()](#tostring)
* [valueOf()](#valueof)
* [toJSON()](#tojson)
* [#isBemEntityName(entityName)](#isbementitynameentityname)
* [#create(object)](#createobject)

### constructor({ block, elem, mod })

Parameter | Type     | Description
----------|----------|------------------------------
`block`   | `string` | The block name of entity.
`elem`    | `string` | The element name of entity.
`mod`     | `string`, `object` | The modifier of entity.<br><br> If specified value is `string` then it will be equivalent to `{ name: string, val: true }`. Optional.
`mod.name`| `string` | The modifier name of entity.
`mod.val` | `string`, `true` | The modifier value of entity. Optional.

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

If you want to get string representation in accordance with the provisions naming convention you should use [@bem/naming](https://github.com/bem-sdk/bem-naming) package.

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

### isSimpleMod()

Determines whether modifier simple or not.

**NOTE**: For entity without modifier `isSimpleMod()` returns `null`.

```js
const BemEntityName = require('@bem/entity-name');
const modName = new BemEntityName({ block: 'button', mod: { name: 'theme' } });
const modVal = new BemEntityName({ block: 'button', mod: { name: 'theme', val: 'normal' } });
const block = new BemEntityName({ block: 'button' });

modName.isSimpleMod(); // true
modVal.isSimpleMod(); // false
block.isSimpleMod(); // null
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
you should use [@bem/naming](https://github.com/bem-sdk/bem-naming) package.

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

### toJSON()

Returns object for `JSON.stringify()` purposes.

### #isBemEntityName(entityName)

Determines whether specified entity is an instance of BemEntityName.

Parameter    | Type            | Description
-------------|-----------------|-----------------------
`entityName` | `BemEntityName` | The entity to check.

```js
const BemEntityName = require('@bem/entity-name');

const entityName = new BemEntityName({ block: 'input' });

BemEntityName.isBemEntityName(entityName); // true
BemEntityName.isBemEntityName({ block: 'button' }); // false
```

### #create(object)

Creates BemEntityName instance by any object representation or a string.

Helper for sugar-free simplicity.

Parameter    | Type               | Description
-------------|--------------------|--------------------------
`object`     | `object`, `string` | Representation of entity name.

Passed Object could have the common field names for entities:

Object field | Type     | Description
-------------|----------|------------------------------
`block`      | `string` | The block name of entity.
`elem`       | `string` | The element name of entity. Optional.
`mod`        | `string`, `object` | The modifier of entity.<br><br> If specified value is `string` then it will be equivalent to `{ name: string, val: true }`. Optional.
`val`        | `string` | The modifier value of entity. Used if `mod` is a string. Optional.
`mod.name`   | `string` | The modifier name of entity. Optional.
`mod.val`    | `string`, `true` | The modifier value of entity. Optional.
`modName`    | `string` | The modifier name of entity. Used if `mod.name` was not specified. Optional.
`modVal`     | `string`, `true` | The modifier value of entity. Used if neither `mod.val` nor `val` were not specified. Optional.

```js
const BemEntityName = require('@bem/entity-name');

BemEntityName.create('my-button');
BemEntityName.create({ block: 'my-button' });
// ➜ BemEntityName { block: 'my-button' }

BemEntityName.create({ block: 'my-button', mod: 'theme', val: 'red' });
BemEntityName.create({ block: 'my-button', modName: 'theme', modVal: 'red' });
// ➜ BemEntityName { block: 'my-button', mod: { name: 'theme', val: 'red' } }

BemEntityName.create({ block: 'my-button', mod: 'focused' });
// ➜ BemEntityName { block: 'my-button', mod: { name: 'focused', val: true } }
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

Also `BemEntityName` has `toJSON` method to support `JSON.stringify()` behaviour.

```js
const BemEntityName = require('@bem/entity-name');

const name = new BemEntityName({ block: 'input', mod: 'available' });

console.log(JSON.stringify(name));

// ➜ {"block":"input","mod":{"name":"available","val":true}}
```


License
-------

Code and documentation © 2016 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
