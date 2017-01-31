bem-naming
==========

Tool for working with [BEM entity](https://en.bem.info/methodology/key-concepts/#bem-entity) representations: allows you to parse [string representation](#string-representation) and stringify [object representation](#object-representation).

[![NPM Status][npm-img]][npm]
[![Travis Status][test-img]][travis]
[![Coverage Status][coverage-img]][coveralls]
[![Dependency Status][dependency-img]][david]

[npm]:            https://www.npmjs.org/package/@bem/naming
[npm-img]:        https://img.shields.io/npm/v/@bem/naming.svg

[travis]:         https://travis-ci.org/bem-sdk/bem-naming
[test-img]:       https://img.shields.io/travis/bem-sdk/bem-naming.svg?label=tests

[coveralls]:      https://coveralls.io/r/bem-sdk/bem-naming
[coverage-img]:   https://img.shields.io/coveralls/bem-sdk/bem-naming.svg

[david]:          https://david-dm.org/bem-sdk/bem-naming
[dependency-img]: http://img.shields.io/david/bem-sdk/bem-naming.svg

Install
-------

```
$ npm install --save @bem/naming
```

Usage
-----

**Parse**
```js
const bemNaming = require('@bem/naming');

bemNaming.parse('button__text'); // BemEntityName { block: 'button', elem: 'text' }
```

**Stringify**
```js
const bemNaming = require('@bem/naming');
const BemEntityName = require('@bem/entity-name');

const entityName = new BemEntityName({ block: 'button', mod: 'checked' });

bemNaming.stringify(entityName); // String 'button_checked'
```

Table of Contents
-----------------

* [Object representation](#object-representation)
* [String representation](#string-representation)
* [Common misconceptions](#common-misconceptions)
* [Harry Roberts' naming convention](#harry-roberts-naming-convention)
* [React naming convention](#react-naming-convention)
* [Custom naming convention](#custom-naming-convention)
* [API](#api)

Object representation
---------------------

The [BemEntityName](https://github.com/bem-sdk/bem-entity-name) class describes the representation of a BEM entity name.

String representation
---------------------

To define BEM entities, we often use a special string format that allows us to define exactly which entity is represented.

According to the original BEM naming convention, it looks like this:

```js
'block[_block-mod-name[_block-mod-val]][__elem-name[_elem-mod-name[_elem-mod-val]]]'
```

*(Parameters within square brackets are optional)*

**Examples:**

* Block — `block-name`.
* Block modifier — `block-name_mod-name_mod-val`.
* Simple modifier of block — `block-name_mod`.
* Block element — `block-name__elem-name`.
* Element modifier — `block-name__elem-name_mod-name_mod-val`.
* Simple modifier of element — `block-name__elem_mod`.

### Delimiters

The original naming uses the following delimiters:

* `__` — to separate an element from a block
* `_` — to separate a modifier name from a block or element and to separate a modifier value from a modifier name

Common misconceptions
---------------------

The BEM methodology uses a flat structure inside blocks. This means that a BEM entity can't be represented as an element of another element, and the following string representation will be invalid:

```js
'block__some-elem__sub-elem'
```

For more information, see the [FAQ](https://en.bem.info/methodology/faq/):

> [Why doesn't BEM recommend using elements within elements (block__elem1__elem2)?](https://en.bem.info/methodology/faq/#why-does-bem-not-recommend-using-elements-within-elements-block__elem1__elem2)

Also, a BEM entity can't be a block modifier and an element modifier simultaneously, so the following string representation will be invalid:

```js
'block_block-mod-name_block-mod-val__elem-name_elem-mod-name_elem-mod-val'
```

Harry Roberts' naming convention
--------------------------------

According to this convention elements are delimited with two underscores (`__`), modifiers are delimited by two hyphens (`--`), and values of modifiers are delimited by one underscore (`_`).

Read more in the [Guidelines](http://cssguidelin.es/#bem-like-naming).

Example:

```js
const twoDashesNaming = require('@bem/naming')('two-dashes');

twoDashesNaming.parse('block__elem');    // { block: 'block', elem: 'elem' }
twoDashesNaming.parse('block--mod_val'); // { block: 'block',
                                         //   mod: { name: 'mod', val: 'val' } }

twoDashesNaming.stringify({
    block: 'block',
    elem: 'elem',
    mod: 'mod'
});

// ➜ block__elem--mod
```

React naming convention
-----------------------

According to this convention elements are delimited with one hyphen (`-`), modifiers are delimited by one underscore (`_`), and values of modifiers are delimited by one underscore (`_`).

You can explore this convention at [bem-react-components](https://github.com/bem/bem-react-components).

Example:

```js
const reactNaming = require('@bem/naming')('react');

reactNaming.parse('block-elem');    // BemEntityName { block: 'block', elem: 'elem' }
reactNaming.parse('block_mod_val'); // BemEntityName { block: 'block',
                                    //                 mod: { name: 'mod', val: 'val' } }

reactNaming.stringify({
    block: 'block',
    elem: 'elem',
    mod: 'mod'
});

// ➜ block-elem_mod
```

Custom naming convention
------------------------

Use the [bemNaming](#bemnaming-elem-mod-wordpattern-) function to create an instance where you can manage your own naming convention.

Example:

```js
const bemNaming = require('@bem/naming');

const myNaming = bemNaming({
    delims: {
        elem: '-',
        mod: { name: '--', val: '_' }
    },
    wordPattern: '[a-zA-Z0-9]+'   // because element and modifier's separators include
});                               // hyphen in it, we need to exclude it from block,
                                  // element and modifier's name

myNaming.parse('block--mod_val'); // BemEntityName
                                  // { block: 'block',
                                  //   mod: { name: 'mod', val: 'val' } }

const BemEntityName = require('@bem/entity-name');

myNaming.stringify(new BemEntityName({
    block: 'blockName',
    elem: 'elemName',
    mod: 'simpleElemMod'
});                               // 'blockName-elemName--simpleElemMod'

```

API
---

* [bemNaming({ delims: {elem, mod}, wordPattern })](#bemnaming-elem-mod-wordpattern-)
* [parse(str)](#parsestr)
* [stringify(obj)](#stringifyobj)
* [elemDelim](#elemdelim)
* [modDelim](#moddelim)
* [modValDelim](#modvaldelim)

### bemNaming({ delims: {elem, mod}, wordPattern })

Parameter         | Type     | Description                                                                       | Default
------------------|----------|-----------------------------------------------------------------------------------|----------------------------------------
`delims`          | `object` | Defines delimeters for elem and/or mods                                           |
`delims.elem`     | `string` | Separates element's name from block.                                              | `__`
`delims.mod`      | `string`, `{ name: string, val: string }` | Separates modifier from block or element.        | `_`
`delims.mod.name` | `string` | Separates a modifier name from a block or an element.                             | `_`
`delims.mod.val`  | `string` | Separates the value of a modifier from the modifier name.                         | Default as the value of the `mod.name`.
`wordPattern`     | `string` | Defines which characters can be used in names of blocks, elements, and modifiers. | `[a-z0-9]+(?:-[a-z0-9]+)*`

### parse(str)

Parameter | Type     | Description
----------|----------|--------------------------------
`str`     | `string` | BEM entity name representation.

Parses the string into an instance of `BemEntityName`.

Example:

```js
const bemNaming = require('@bem/naming');

bemNaming.parse('block__elem_mod_val');

// ➜ BemEntityName {
//     block: 'block',
//     elem: 'elem',
//     mod: { name: 'mod', val: 'val' }
// }
```

### stringify(entityName)

Parameter    | Type                      | Description
-------------|---------------------------|--------------------------------
`entityName` | `BemEntityName`, `object` | BEM entity name representation.

Forms a string from the instance of `BemEntityName`.

Example:

```js
const bemNaming = require('@bem/naming');
const BemEntityName = require('@bem/entity-name');

bemNaming.stringify(new BemEntityName({
    block: 'block',
    elem: 'elem',
    mod: { name: 'mod', val: 'val' }
});

// ➜ block__elem_mod_val
```

### elemDelim

String to separate an element from a block.

### modDelim

String to separate a modifier name from a block or element.

### modValDelim

String to separate a modifier value from the name of the modifier.

License
-------

Code and documentation copyright 2014 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
