bem-naming
==========

[![NPM Status][npm-img]][npm]
[![Travis Status][test-img]][travis]
[![Coverage Status][coverage-img]][coveralls]

[npm]:          https://www.npmjs.org/package/bem-naming
[npm-img]:      https://img.shields.io/npm/v/bem-naming.svg

[travis]:       https://travis-ci.org/bem-sdk/bem-naming
[test-img]:     https://img.shields.io/travis/bem-sdk/bem-naming.svg?label=tests

[coveralls]:    https://coveralls.io/r/bem-sdk/bem-naming
[coverage-img]: https://img.shields.io/coveralls/bem-sdk/bem-naming.svg

Tool for working with [BEM entity](https://en.bem.info/methodology/key-concepts/#bem-entity) representations: allows you to parse [string representation](#string-representation) and stringify [object representation](#object-representation).

Install
-------

```
$ npm install --save bem-naming
```

Usage
-----

```js
const bemNaming = require('@bem/naming');
const BemEntityName = require('@bem/entity-name');

bemNaming.parse('button__text'); // { block: 'button', elem: 'text' }

const entityName = new BemEntityName({ block: 'button', mod: 'checked' });

bemNaming.stringify(entityName); // button_checked
```

Table of Contents
-----------------

* [Object representation](#object-representation)
* [String representation](#string-representation)
* [API](#api)
* [Common misconceptions](#common-misconceptions)
* [Custom naming convention](#custom-naming-convention)
* [Convention by Harry Roberts](#convention-by-harry-roberts)

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

API
---

* [parse(str)](#parsestr)
* [stringify(obj)](#stringifyobj)
* [elemDelim](#elemdelim)
* [modDelim](#moddelim)
* [modValDelim](#modvaldelim)

### parse(str)

It parses string into naming object.

Example:

```js
const bemNaming = require('bem-naming');

bemNaming.parse('block__elem_mod_val');  // { block: 'block', elem: 'elem',
                                         //   modName: 'mod', modVal: 'val' }
```

### stringify(obj)

It forms a string according to naming object.

Example:

```js
const bemNaming = require('bem-naming');

bemNaming.stringify({
    block: 'block', elem: 'elem',
    modName: 'mod', modVal: 'val'
}); // 'block__elem_mod_val'
```

### elemDelim

String to separate element from block.

### modDelim

String to separate modifier name from block or element.

### modValDelim

String to separate value of modifier from name of modifier.

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

Custom naming convention
------------------------

Use `bemNaming` function to create instance to manage naming of your own naming convention.

Example:

```js
const bemNaming = require('bem-naming');

const myNaming = bemNaming({
    elem: '-',
    mod: { name: '--', val: '_' }
    wordPattern: '[a-zA-Z0-9]+'   // because element and modifier's separators include
});                               // hyphen in it, we need to exclude it from block,
                                  // element and modifier's name

myNaming.parse('block--mod_val'); // { block: 'block',
                                  //   modName: 'mod', modVal: 'val' }

myNaming.stringify({              // 'blockName-elemName--boolElemMod'
    block: 'blockName',
    elem: 'elemName',
    modName: 'boolElemMod'
});
```

### bemNaming({ elem, mod, wordPattern })

#### elem

Type: `String`

Default: `__`

Separates element's name from block

#### mod

Type: `String`, `{ name: String, val: String }`

Default: `_`

Separates modifiers from blocks and elements.

This option can take object with following fields:

* `name` — separates name of modifier from blocks and elements.

  Default as `_`.

* `val` — separates value of modifier from name of modifier.

  Default as the value of the `name`.

#### wordPattern

Type: `String`

Default: `[a-z0-9]+(?:-[a-z0-9]+)*`

Defines which symbols can be used for block, element and modifier's names.

Convention by Harry Roberts
---------------------------

According to this convention elements are delimited with two underscores (`__`), modifiers are delimited by two hyphens (`--`), and values of modifiers are delimited by one underscore (`_`).

Read more in the [Guidelines](http://cssguidelin.es/#bem-like-naming).

Example:

```js
const bemNaming = require('bem-naming');

const twoDashes = bemNaming('two-dashes');

twoDashes.parse('block__elem');    // { block: 'block', elem: 'elem' }
twoDashes.parse('block--mod_val'); // { block: 'block',
                                   //   modName: 'mod', modVal: 'val' }

twoDashes.stringify({              // 'block__elem--mod'
    block: 'block',
    elem: 'elem',
    modName: 'mod'
});
```

License
-------

Code and documentation copyright 2014 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
