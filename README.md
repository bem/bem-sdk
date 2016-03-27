bem-naming
==========

[![NPM Status][npm-img]][npm]
[![Travis Status][test-img]][travis]
[![Coverage Status][coverage-img]][coveralls]

[npm]:          https://www.npmjs.org/package/bem-naming
[npm-img]:      https://img.shields.io/npm/v/bem-naming.svg

[travis]:       https://travis-ci.org/bem/bem-naming
[test-img]:     https://img.shields.io/travis/bem/bem-naming.svg

[coveralls]:    https://coveralls.io/r/bem/bem-naming
[coverage-img]: https://img.shields.io/coveralls/bem/bem-naming.svg

About
-----

This tool allows getting information about BEM entity using [string](#string-representation) as well as forming string representation based on [naming object](#object-representation-of-bem-entity).

Install
-------

```
$ npm install --save bem-naming
```

Usage
-----

```js
var bemNaming = require('bem-naming');

bemNaming.parse('button__text'); // { block: 'button', elem: 'text' }

bemNaming.stringify({ block: 'button', modName: 'checked' }); // button_checked
```

Table of Contents
-----------------

* [String representation](#string-representation)
* [Object representation of BEM entity](#object-representation-of-bem-entity)
* [API](#api)
* [Common misconceptions](#common-misconceptions)
* [Custom naming convention](#custom-naming-convention)
* [Convention by Harry Roberts](#convention-by-harry-roberts)

String representation
---------------------
To define BEM entities we often use a special string format that allows us 100% define what entity exactly is represented.

According to original BEM-naming convention it looks like the following:

```js
'block[_block-mod-name[_block-mod-val]][__elem-name[_elem-mod-name[_elem-mod-val]]]'
```

*(Parameters within square brackets are optional)*

* Block — `block-name`.
* Block's modifier in key-value format — `block-name_mod-name_mod-val`.
* Block's boolean modifier — `block-name_mod`.
* Block's element — `block-name__elem-name`.
* Element's modifier in key-value format — `block-name__elem-name_mod-name_mod-val`.
* Element's boolean modifier — `block-name__elem_mod`.

Object representation of BEM entity
-----------------------------------

BEM entities can be defined with a help of JS object with the following fields:

* `block` — a block name. The field is required because only a block exists as an independent BEM entity
* `elem` — an element name.
* `modName` — a modifier name.
* `modVal` — a modifier value.

The modifier consists of a pair of fields `modName` and `modVal`. This means that the field `modVal` without `modName` has no meaning.

Example:

```js
// The block modifier
{
    block: 'block',
    modName: 'mod',
    modVal: 'val'
}

// Not valid BEM-notation
{
    block: 'block',
    modVal: 'val'
}
```

To describe the boolean modifier field `modVal` must be specified as `true`.

Example:

```js
// Boolean modifier of a block
{
    block: 'block',
    modName: 'mod',
    modVal: true
}

// Shorthand for the boolean modifier of a block
{
    block: 'block',
    modName: 'mod'
}

// Not valid BEM-notation
{
    block: 'block',
    modName: 'mod',
    modVal: false
}
```

API
---

* [validate(str)](#validatestr)
* [parse(str)](#parsestr)
* [stringify(obj)](#stringifyobj)
* [typeOf(str)](#typeofstr)
* [typeOf(obj)](#typeofobj)
* [isBlock(str)](#isblockstr)
* [isBlock(obj)](#isblockobj)
* [isBlockMod(str)](#isblockmodstr)
* [isBlockMod(obj)](#isblockmodobj)
* [isElem(str)](#iselemstr)
* [isElem(obj)](#iselemobj)
* [isElemMod(str)](#iselemmodstr)
* [isElemMod(obj)](#iselemmodobj)
* [elemDelim](#elemdelim)
* [modDelim](#moddelim)
* [modValDelim](#modvaldelim)

### validate(str)

Checks a string to be valid BEM notation.

Example:

```js
bemNaming.validate('block-name');  // true
bemNaming.validate('^*^');         // false
```

### parse(str)

It parses string into naming object.

Example:

```js
bemNaming.parse('block__elem_mod_val');  // { block: 'block', elem: 'elem',
                                         //   modName: 'mod', modVal: 'val' }
```

### stringify(obj)

It forms a string according to naming object.

Example:

```js
bemNaming.stringify({
    block: 'block', elem: 'elem',
    modName: 'mod', modVal: 'val'
}); // 'block__elem_mod_val'
```

### `typeOf(str)`

Returns a string indicating the type of the BEM entity.

Example:

```js
bemNaming.typeOf('block');             // block
bemNaming.typeOf('block_mod');         // blockMod
bemNaming.typeOf('block__elem');       // elem
bemNaming.typeOf('block__elem_mod');   // elemMod
```

### typeOf(obj)

Returns a string indicating the type of the BEM entity.

Example:

```js
bemNaming.typeOf({ block: 'block' });                               // block
bemNaming.typeOf({ block: 'block', modName: 'mod' });               // blockMod
bemNaming.typeOf({ block: 'block', elem: 'elem' });                 // elem
bemNaming.typeOf({ block: 'block', elem: 'elem', modName: 'mod' }); // elemMod
```

### isBlock(str)

Checks whether string is a block.

Example:

```js
bemNaming.isBlock('block-name');   // true
bemNaming.isBlock('block__elem');  // false
```

### isBlock(obj)

Checks whether naming object is a block.

Example:

```js
bemNaming.isBlock({ block: 'block-name' });           // true
bemNaming.isBlock({ block: 'block', elem: 'elem' });  // false
```

### isBlockMod(str)

Checks whether string is modifier of a block.

Example:

```js
bemNaming.isBlockMod('block_mod');        // true
bemNaming.isBlockMod('block__elem_mod');  // false
```

### isBlockMod(obj)

Checks whether naming object is modifier of a block.

Example:

```js
bemNaming.isBlockMod({ block: 'block',
    modName: 'mod', modVal: true });  // true

bemNaming.isBlockMod({ block: 'block', elem: 'elem',
    modName: 'mod', modVal: true });  // false
```

### isElem(str)

Checks whether string is element of a block.

Example:

```js
bemNaming.isElem('block__elem');  // true
bemNaming.isElem('block-name');   // false
```

### isElem(obj)

Checks whether naming object is element of a block.

Example:

```js
bemNaming.isElem({ block: 'block', elem: 'elem' });  // true
bemNaming.isElem({ block: 'block-name' });           // false
```

### isElemMod(str)

Checks whether string is modifier of an element.

Example:

```js
bemNaming.isElemMod('block__elem_mod');  // true
bemNaming.isElemMod('block__elem');      // false
```

### isElemMod(obj)

Checks whether naming object is modifier of an element.

Example:

```js
bemNaming.isElemMod({ block: 'block', elem: 'elem',
    modName: 'mod', modVal: true });  // true

bemNaming.isElemMod({ block: 'block',
    modName: 'mod', modVal: true});   // false
```

### elemDelim

String to separate elem from block.

### modDelim

String to separate modifiers from blocks and elements.

### modValDelim

String to separate value of modifier from name of modifier.

Common misconceptions
---------------------

BEM methodology involves the use of flat structure inside a block. It means that BEM entity can not be represented as an element of the other element and the following string representation will be invalid:

```js
'block__some-elem__sub-elem'
```

Also there is no such BEM entity as a modifier and an element modifier simultaneously so the following string representation will be invalid:

```js
'block_block-mod-name_block-mod-val__elem-name_elem-mod-name_elem-mod-val'
```

Custom naming convention
------------------------

Use `bemNaming` function to create instance to manage naming of your own naming convention.

Example:

```js
var myNaming = bemNaming({
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
var twoDashes = bemNaming('two-dashes');

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
