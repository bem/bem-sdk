BemjsonNode
===========

[BEM tree](https://en.bem.info/methodology/key-concepts/#bem-tree) node representation.

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.org/package/@bem/sdk.bemjson-node
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.bemjson-node.svg

Contents
--------

* [Install](#install)
* [Usage](#usage)
* [API](#api)
* [Serialization](#serialization)
* [Debuggability](#debuggability)

Install
-------

```sh
$ npm install --save @bem/sdk.bemjson-node
```

Usage
-----

```js
const BemjsonNode = require('@bem/sdk.bemjson-node');

const bemjsonNode = new BemjsonNode({ block: 'button', elem: 'text' });

bemjsonNode.block;     // button
bemjsonNode.elem;      // text
bemjsonNode.mods;      // {}
bemjsonNode.elemMods;  // {}
```

API
---

* [constructor({ block, mods, elem, elemMods, mix })](#constructor-block-mods-elem-elemmods-mix)
* [block](#block)
* [elem](#elem)
* [mods](#mods)
* [elemMods](#elemMods)
* [mix](#mix)
* [valueOf()](#valueof)
* [toJSON()](#tojson)
* [toString()](#tostring)
* [static isBemjsonNode(bemjsonNode)](#static-isbemjsonnodebemjsonnode)

### constructor({ block, mods, elem, elemMods, mix })

Parameter  | Type     | Description
-----------|----------|------------------------------
`block`    | `string` | The block name of entity.
`mods`     | `object` | An object of modifiers for block entity. Optional.
`elem`     | `string` | The element name of entity. Optional.
`elemMods` | `object` | An object of modifiers for element entity.<br><br> Should not be used without `elem` field. Optional.
`mix`      | `string`, `object` or `array` | An array of mixed bemjson nodes.<br><br> From passed strings and objects will be created bemjson node objects. Optional.

```js
const BemjsonNode = require('@bem/sdk.bemjson-node');

// The block with modifier
new BemjsonNode({
    block: 'button',
    mods: { view: 'action' }
});

// The element inside block with modifier
new BemjsonNode({
    block: 'button',
    mods: { view: 'action' },
    elem: 'inner'
});

// The element node with modifier
new BemjsonNode({
    block: 'button',
    elem: 'icon',
    elemMods: { type: 'load' }
});

// The block with a mixed element
new BemjsonNode({
    block: 'button',
    mix: { block: 'button', elem: 'text' }
});

// Invalid value in mods field
new BemjsonNode({
    block: 'button',
    mods: 'icon'
});
// ➜ AssertionError: @bem/sdk.bemjson-node: `mods` field should be a simple object or null.
```

### block

The name of block to which entity in this node belongs.

```js
const BemjsonNode = require('@bem/sdk.bemjson-node');
const name = new BemjsonNode({ block: 'button' });

name.block; // button
```

### elem

The name of element to which entity in this node belongs.

**Important:**  Contains `null` value if node is a block entity.

```js
const BemjsonNode = require('@bem/sdk.bemjson-node');
const node1 = new BemjsonNode({ block: 'button' });
const node2 = new BemjsonNode({ block: 'button', elem: 'text' });

node1.elem; // null
node2.elem; // "text"
```

### mods

The object with modifiers of this node.

**Important:** Contains modifiers of a scope (block) node if this node IS an element.

```js
const BemjsonNode = require('@bem/sdk.bemjson-node');

const blockNode = new BemjsonNode({ block: 'button' });
const modsNode = new BemjsonNode({ block: 'button', mods: { disabled: true } });
const elemNode = new BemjsonNode({ block: 'button', mods: { disabled: true }, elem: 'text' });

blockNode.mods; // { }
elemNode.mods;  // { disabled: true }
modsNode.mods;  // { disabled: true }
```

### elemMods

The object with modifiers of this node.

**Important:** Contains `null` if node IS NOT an element.

```js
const BemjsonNode = require('@bem/sdk.bemjson-node');

const blockNode = new BemjsonNode({ block: 'button' });
const modsNode = new BemjsonNode({ block: 'button', mods: { disabled: true } });
const elemNode = new BemjsonNode({ block: 'button', elem: 'text' });
const emodsNode = new BemjsonNode({ block: 'button', elem: 'text', elemMods: { highlighted: true } });

blockNode.elemMods; // null
modsNode.elemMods;  // null
elemNode.elemMods;  // { }
emodsNode.elemMods; // { disabled: true }
```

### valueOf()

Returns normalized object representing the bemjson node.

```js
const BemjsonNode = require('@bem/sdk.bemjson-node');
const node = new BemjsonNode({ block: 'button', mods: { focused: true }, elem: 'text' });

node.valueOf();

// ➜ { block: 'button', mods: { focused: true }, elem: 'text', elemMods: { } }
```

### toJSON()

Returns raw data for `JSON.stringify()` purposes.

```js
const BemjsonNode = require('@bem/sdk.bemjson-node');

const node = new BemjsonNode({ block: 'input', mods: { available: true } });

JSON.stringify(node); // {"block":"input","mods":{"available":true}}
```

### toString()

Returns string representing the bemjson node.

```js
const BemjsonNode = require('@bem/sdk.bemjson-node');
const node = new BemjsonNode({
    block: 'button', mods: { focused: true },
    mix: { block: 'mixed', mods: { bg: 'red' } }
});

node.toString(); // "button _focused  mixed _bg_red"
```

### static isBemjsonNode(bemjsonNode)

Determines whether specified object is an instance of BemjsonNode.

Parameter     | Type            | Description
--------------|-----------------|-----------------------
`bemjsonNode` | `*`             | The object to check.

```js
const BemjsonNode = require('@bem/sdk.bemjson-node');

const bemjsonNode = new BemjsonNode({ block: 'input' });

BemjsonNode.isBemjsonNode(bemjsonNode); // true
BemjsonNode.isBemjsonNode({ block: 'button' }); // false
```

Serialization
-------------

The `BemjsonNode` has `toJSON` method to support `JSON.stringify()` behaviour.

Use `JSON.stringify` to serialize an instance of `BemjsonNode`.

```js
const BemjsonNode = require('@bem/sdk.bemjson-node');

const node = new BemjsonNode({ block: 'input', mod: 'available' });

JSON.stringify(node); // {"block":"input","mods":{"available":true}}
```

Use `JSON.parse` to deserialize JSON string and create an instance of `BemjsonNode`.

```js
const BemjsonNode = require('@bem/sdk.bemjson-node');

const str = '{"block":"input","mods":{"available"::true}}';

new BemjsonNode(JSON.parse(str)); // BemjsonNode({ block: 'input', mods: { available: true } });
```

Debuggability
-------------

In Node.js, `console.log()` calls `util.inspect()` on each argument without a formatting placeholder.

`BemjsonNode` has `inspect()` method to get custom string representation of the object.

```js
const BemjsonNode = require('@bem/sdk.bemjson-node');

const node = new BemjsonNode({ block: 'input', mods: { available: true } });

console.log(node);

// ➜ BemjsonNode { block: 'input', mods: { available: true } }
```

You can also convert `BemjsonNode` object to `string`.

```js
const BemjsonNode = require('@bem/sdk.bemjson-node');

const node = new BemjsonNode({ block: 'input', mods: { available: true } });

console.log(`node: ${node}`);

// ➜ node: input _available
```

License
-------

Code and documentation © 2017 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
