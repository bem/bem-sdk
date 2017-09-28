# BemEntityName

[BEM entity](https://en.bem.info/methodology/key-concepts/#bem-entity) name representation.

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.org/package/@bem/sdk.entity-name
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.entity-name.svg

Contents
--------

* [Install](#install)
* [Usage](#usage)
* [API](#api)
* [Serialization](#serialization)
* [TypeScript support](#typescript-support)
* [Debuggability](#debuggability)
* [Deprecation](#deprecation)

Install
-------

```sh
$ npm install --save @bem/sdk.entity-name
```

Usage
-----

```js
const BemEntityName = require('@bem/sdk.entity-name');

const entityName = new BemEntityName({ block: 'button', elem: 'text' });

entityName.block; // button
entityName.elem;  // text
entityName.mod;   // undefined

entityName.id;   // button__elem
entityName.type; // elem

entityName.isEqual(new BemEntityName({ block: 'button' }));               // false
entityName.isEqual(new BemEntityName({ block: 'button', elem: 'text' })); // true
```

API
---

* [constructor({ block, elem, mod })](#constructor-block-elem-mod-)
* [block](#block)
* [elem](#elem)
* [mod](#mod)
* [type](#type)
* [scope](#scope)
* [id](#id)
* [isSimpleMod()](#issimplemod)
* [isEqual(entityName)](#isequalentityname)
* [belongsTo(entityName)](#belongstoentityname)
* [valueOf()](#valueof)
* [toJSON()](#tojson)
* [toString()](#tostring)
* [static create(obj)](#static-createobj)
* [static isBemEntityName(entityName)](#static-isbementitynameentityname)

### constructor({ block, elem, mod })

Parameter | Type     | Description
----------|----------|------------------------------
`block`   | `string` | The block name of entity.
`elem`    | `string` | The element name of entity.
`mod`     | `string`, `object` | The modifier of entity.<br><br> If specified value is `string` then it will be equivalent to `{ name: string, val: true }`. Optional.
`mod.name`| `string` | The modifier name of entity.
`mod.val` | `string`, `true` | The modifier value of entity. Optional.

BEM entities can be defined with a help of JS object with the following fields:

* `block` — a block name. The field is required because only a block exists as an independent BEM entity
* `elem` — an element name.
* `mod` —  a modifier.

The modifier consists of a pair of fields `mod.name` and `mod.val`. This means that the field `mod.val` without `mod.name` has no meaning.

```js
const BemEntityName = require('@bem/sdk.entity-name');

// The modifier of block
new BemEntityName({
    block: 'button',
    mod: { name: 'view', val: 'action' }
});

// Not valid modifier
new BemEntityName({
    block: 'button',
    mod: { val: 'action' }
});
// ➜ EntityTypeError: the object `{ block: 'block', mod: { val: 'action' } }` is not valid BEM entity, the field `mod.name` is undefined
```

To describe a simple modifier the `mod.val` field must be omitted.

```js
// Simple modifier of a block
new BemEntityName({ block: 'button', mod: 'focused' });

// Is equivalent to simple modifier, if `mod.val` is `true`
new BemEntityName({
    block: 'button',
    mod: { name: 'focused', val: true }
});
```

### block

The name of block to which this entity belongs.

```js
const BemEntityName = require('@bem/sdk.entity-name');
const name = new BemEntityName({ block: 'button' });

name.block; // button
```

### elem

The element name of this entity.

If entity is not element or modifier of element then returns empty string.

```js
const BemEntityName = require('@bem/sdk.entity-name');
const name = new BemEntityName({ block: 'button', elem: 'text' });

name.elem; // text
```

### mod

The modifier of this entity.

**Important:** If entity is not a modifier then returns `undefined`.

```js
const BemEntityName = require('@bem/sdk.entity-name');

const blockName = new BemEntityName({ block: 'button' });
const modName = new BemEntityName({ block: 'button', mod: 'disabled' });

modName.mod;   // { name: 'disabled', val: true }
blockName.mod; // undefined
```

### type

The type for this entity.

Possible values: `block`, `elem`, `blockMod`, `elemMod`.

```js
const BemEntityName = require('@bem/sdk.entity-name');

const elemName = new BemEntityName({ block: 'button', elem: 'text' });
const modName = new BemEntityName({ block: 'menu', elem: 'item', mod: 'current' });

elemName.type; // elem
modName.type;  // elemMod
```

### scope

The scope of this entity.

**Important:** block-typed entities has no scope.

```js
const BemEntityName = require('@bem/sdk.entity-name');

const buttonName = new BemEntityName({ block: 'button' });
const buttonTextName = new BemEntityName({ block: 'button', elem: 'text' });
const buttonTextBoldName = new BemEntityName({ block: 'button', elem: 'text', mod: 'bold' });

buttonName.scope;         // null
buttonTextName.scope;     // BemEntityName { block: 'button' }
buttonTextBoldName.scope; // BemEntityName { block: 'button', elem: 'elem' }
```

### id

The id for this entity.

**Important:** should only be used to determine uniqueness of entity.

If you want to get string representation in accordance with the provisions naming convention you should use [@bem/naming](https://github.com/bem/bem-sdk/tree/master/packages/naming) package.

```js
const BemEntityName = require('@bem/sdk.entity-name');
const name = new BemEntityName({ block: 'button', mod: 'disabled' });

name.id; // button_disabled
```

### isSimpleMod()

Determines whether modifier simple or not.

**NOTE**: For entity without modifier `isSimpleMod()` returns `null`.

```js
const BemEntityName = require('@bem/sdk.entity-name');
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
const BemEntityName = require('@bem/sdk.entity-name');

const inputName = new BemEntityName({ block: 'input' });
const buttonName = new BemEntityName({ block: 'button' });

inputName.isEqual(buttonName);  // false
buttonName.isEqual(buttonName); // true
```

### belongsTo(entityName)

Parameter    | Type            | Description
-------------|-----------------|-----------------------
`entityName` | `BemEntityName` | The entity to compare.

Determines whether specified entity belongs to this.

```js
const BemEntityName = require('@bem/sdk.entity-name');

const buttonName = new BemEntityName({ block: 'button' });
const buttonTextName = new BemEntityName({ block: 'button', elem: 'text' });
const buttonTextBoldName = new BemEntityName({ block: 'button', elem: 'text', mod: 'bold' });

buttonTextName.belongsTo(buttonName);         // true
buttonName.belongsTo(buttonTextName);         // false
buttonTextBoldName.belongsTo(buttonTextName); // true
buttonTextBoldName.belongsTo(buttonName);     // false
```

### valueOf()

Returns normalized object representing the entity name.

```js
const BemEntityName = require('@bem/sdk.entity-name');
const name = new BemEntityName({ block: 'button', mod: 'focused' });

name.valueOf();

// ➜ { block: 'button', mod: { name: 'focused', value: true } }
```

### toJSON()

Returns raw data for `JSON.stringify()` purposes.

```js
const BemEntityName = require('@bem/sdk.entity-name');

const name = new BemEntityName({ block: 'input', mod: 'available' });

JSON.stringify(name); // {"block":"input","mod":{"name":"available","val":true}}
```

### toString()

Returns string representing the entity name.

**Important:** if you want to get string representation in accordance with the provisions naming convention
you should use [@bem/naming](https://github.com/bem/bem-sdk/tree/master/packages/naming) package.

```js
const BemEntityName = require('@bem/sdk.entity-name');
const name = new BemEntityName({ block: 'button', mod: 'focused' });

name.toString(); // button_focused
```

### static create(object)

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
const BemEntityName = require('@bem/sdk.entity-name');

BemEntityName.create('my-button');
BemEntityName.create({ block: 'my-button' });
// ➜ BemEntityName { block: 'my-button' }

BemEntityName.create({ block: 'my-button', mod: 'theme', val: 'red' });
BemEntityName.create({ block: 'my-button', modName: 'theme', modVal: 'red' });
// ➜ BemEntityName { block: 'my-button', mod: { name: 'theme', val: 'red' } }

BemEntityName.create({ block: 'my-button', mod: 'focused' });
// ➜ BemEntityName { block: 'my-button', mod: { name: 'focused', val: true } }
```

### static isBemEntityName(entityName)

Determines whether specified entity is an instance of BemEntityName.

Parameter    | Type            | Description
-------------|-----------------|-----------------------
`entityName` | `*`             | The entity to check.

```js
const BemEntityName = require('@bem/sdk.entity-name');

const entityName = new BemEntityName({ block: 'input' });

BemEntityName.isBemEntityName(entityName); // true
BemEntityName.isBemEntityName({ block: 'button' }); // false
```

Serialization
-------------

The `BemEntityName` has `toJSON` method to support `JSON.stringify()` behaviour.

Use `JSON.stringify` to serialize an instance of `BemEntityName`.

```js
const BemEntityName = require('@bem/sdk.entity-name');

const name = new BemEntityName({ block: 'input', mod: 'available' });

JSON.stringify(name); // {"block":"input","mod":{"name":"available","val":true}}
```

Use `JSON.parse` to deserialize JSON string and create an instance of `BemEntityName`.

```js
const BemEntityName = require('@bem/sdk.entity-name');

const str = '{"block":"input","mod":{"name":"available","val":true}}';

new BemEntityName(JSON.parse(str)); // BemEntityName({ block: 'input', mod: 'available' });
```

TypeScript support
------------------

The package includes [typings](./index.d.ts) for TypeScript. You have to set up transpilation yourself. When you set `module` to `commonjs` in your `tsconfig.json` file, TypeScript will automatically find the type definitions for `@bem/sdk.entity-name`.

The interfaces are provided in global namespace `BEMSDK.EntityName`. It is necessary to use interfaces in JsDoc.

Debuggability
-------------

In Node.js, `console.log()` calls `util.inspect()` on each argument without a formatting placeholder.

`BemEntityName` has `inspect()` method to get custom string representation of the object.

```js
const BemEntityName = require('@bem/sdk.entity-name');

const name = new BemEntityName({ block: 'input', mod: 'available' });

console.log(name);

// ➜ BemEntityName { block: 'input', mod: { name: 'available' } }
```

You can also convert `BemEntityName` object to `string`.

```js
const BemEntityName = require('@bem/sdk.entity-name');

const name = new BemEntityName({ block: 'input', mod: 'available' });

console.log(`name: ${name}`);

// ➜ name: input_available
```

Deprecation
-----------

Deprecation is performed with [depd](https://github.com/dougwilson/nodejs-depd).

To silencing deprecation warnings from being output use the `NO_DEPRECATION` environment variable.

```
NO_DEPRECATION=@bem/sdk.entity-name node app.js
```

> More [details](https://github.com/dougwilson/nodejs-depd#processenvno_deprecation) in `depd` documentation

License
-------

Code and documentation © 2016 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
