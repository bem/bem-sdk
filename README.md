bem-naming
==========

Tool for working with [BEM entity](https://en.bem.info/methodology/key-concepts/#bem-entity) representations: allows you to parse [string representation](#string-representation) and stringify [object representation](#object-representation).

Supports various [naming conventions](#naming-conventions): [origin](#origin-naming-convention), [two-dashes](#harry-roberts-naming-convention), [react]((#react-naming-convention)) and allows to create your convention.

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

```js
const bemNaming = require('@bem/naming');

bemNaming.parse('button__text'); // BemEntityName { block: 'button', elem: 'text' }
bemNaming.stringify({ block: 'button', mod: 'checked' }); // String 'button_checked'
```

Table of Contents
-----------------

* [BEM Entity representation](#bem-entity-representation)
  * [Object representation](#object-representation)
  * [String representation](#string-representation)
* [Common misconceptions](#common-misconceptions)
* [Naming conventions](#naming-conventions)
  * [Origin naming convention](#origin-naming-convention)
  * [Harry Roberts' naming convention](#harry-roberts-naming-convention)
  * [React naming convention](#react-naming-convention)
  * [Custom naming convention](#custom-naming-convention)
* [API](#api)
  * [bemNaming({ delims: {elem, mod}, wordPattern })](#bemnaming-delims-elem-mod-wordpattern-)
  * [parse(str)](#parsestr)
  * [stringify(obj)](#stringifyobj)
  * [delims](#delims)

BEM Entity representation
-------------------------

With [BEM entity](https://en.bem.info/methodology/key-concepts/#bem-entity) representation you can define block, element, block modifier and element modifier.

The representation can include name of block, name of element, name of modifier and value of modifier.

BEM entity can be represented using `Object` or `String`.

### Object representation

The [BemEntityName](https://github.com/bem-sdk/bem-entity-name) class describes the representation of a BEM entity name.

### String representation

To define BEM entities, we often use a special string format that allows us to define exactly which entity is represented.

According to the original BEM naming convention, it looks like this:

```js
'block[_block-mod-name[_block-mod-val]][__elem-name[_elem-mod-name[_elem-mod-val]]]'
```

*(Parameters within square brackets are optional)*

#### Delimiters

The names are separated from each other by means of special delimiters.

The original naming uses the following delimiters:

* `__` — to separate an element from a block
* `_` — to separate a modifier name from a block or element and to separate a modifier value from a modifier name

#### Examples

| BEM Entity Type  | String Representation                      |
|------------------|--------------------------------------------|
| Block            | `block-name`                               |
| Block modifier   | `block-scope_mod-name_mod-val`             |
| Element          | `block-scope__elem-name`                   |
| Element modifier | `block-scope__elem-scope_mod-name_mod-val` |

The simple modifier doesn't have value. Therefore, in the string representation the value should be omitted.

| BEM Entity Type  | String Representation              |
|------------------|------------------------------------|
| Block modifier   | `block-scope_mod-name`             |
| Element modifier | `block-scope__elem-scope_mod-name` |

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

Naming conventions
------------------

The main idea of the naming convention is to make names of [BEM entities](https://en.bem.info/methodology/key-concepts/#bem-entity) as informative and clear as possible.

> Read more in the section [naming convention](https://en.bem.info/methodology/naming-convention/) of the [BEM methodology](https://en.bem.info/methodology/).

The BEM methodology provides an idea for creating naming rules and implements that idea in its canonical naming convention: [origin naming convention](#origin-naming-convention).

However, a number of alternative schemes based on the BEM principles also exist in the world of web development:

* [Harry Roberts' naming convention](#harry-roberts-naming-convention)
* [React naming convention](#react-naming-convention)

In addition, you can invent your naming convention. How to do this, see the [Custom naming convention](#custom-naming-convention) section.

### Origin naming convention

According to this convention elements are delimited with two underscores (`__`), modifiers and values of modifiers are delimited by one underscore (`_`).

> Read more in the section [naming convention](https://en.bem.info/methodology/naming-convention/) of the [BEM methodology](https://en.bem.info/methodology/).

Example:

```js
const originNaming = require('@bem/naming')('origin');

originNaming.parse('block__elem');    // BemEntityName { block: 'block', elem: 'elem' }
originNaming.parse('block_mod_val');  // BemEntityName { block: 'block',
                                      //                 mod: { name: 'mod', val: 'val' } }

originNaming.stringify({
    block: 'block',
    elem: 'elem',
    mod: 'mod'
});

// ➜ block__elem_mod
```

### Harry Roberts' naming convention

According to this convention elements are delimited with two underscores (`__`), modifiers are delimited by two hyphens (`--`), and values of modifiers are delimited by one underscore (`_`).

> Read more in the [Guidelines](http://cssguidelin.es/#bem-like-naming).

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

### React naming convention

According to this convention elements are delimited with one hyphen (`-`), modifiers are delimited by one underscore (`_`), and values of modifiers are delimited by one underscore (`_`).

> You can explore this convention at [bem-react-components](https://github.com/bem/bem-react-components).

Example:

```js
const reactNaming = require('@bem/naming')('react');

reactNaming.parse('Block-Elem');    // BemEntityName { block: 'Block', elem: 'Elem' }
reactNaming.parse('Block_Mod_Val'); // BemEntityName { block: 'Block',
                                    //                 mod: { name: 'Mod', val: 'Val' } }

reactNaming.stringify({
    block: 'Block',
    elem: 'Elem',
    mod: 'Mod'
});

// ➜ Block-Elem_Mod
```

### Custom naming convention

To create an instance where you can manage your own naming convention use the [bemNaming](#bemnaming-elem-mod-wordpattern-) function.

Example:

```js
const createBemNaming = require('@bem/naming');

const myNaming = createBemNaming({
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
});

// ➜ blockName-elemName--simpleElemMod
```

API
---

* [bemNaming({ delims: {elem, mod}, wordPattern })](#bemnaming-delims-elem-mod-wordpattern-)
* [parse(str)](#parsestr)
* [stringify(obj)](#stringifyobj)
* [delims](#delims)

### bemNaming({ delims: {elem, mod}, wordPattern })

Parameter         | Type     | Description                                                                       | Default
------------------|----------|-----------------------------------------------------------------------------------|----------------------------------------
`delims`          | `object` | Defines delimeters for elem and/or mods                                           |
`delims.elem`     | `string` | Separates element's name from block.                                              | `__`
`delims.mod`      | `string`, `{ name: string, val: string }` | Separates modifier from block or element.        | `_`
`delims.mod.name` | `string` | Separates a modifier name from a block or an element.                             | `_`
`delims.mod.val`  | `string` | Separates the value of a modifier from the modifier name.                         | `_`
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

### delims

Strings to separate names of bem entities.

Type: `Object`

#### delims.elem

String to separate an element from a block.

Type: `String`

Default: `__`

#### delims.mod.name

String to separate a modifier name from a block or element.

Type: `String`

Default: `_`

#### delims.mod.val

String to separate a modifier value from the name of the modifier.

Type: `String`

Default: `_`

License
-------

Code and documentation copyright 2014 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
