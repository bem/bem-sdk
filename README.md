bem-naming
==========

[![NPM version](http://img.shields.io/npm/v/bem-naming.svg?style=flat)](http://badge.fury.io/js/bem-naming) [![Download](http://img.shields.io/badge/download-1%20kB-blue.svg?style=flat)](https://github.com/bem/bem-naming/releases/v0.2.1) [![Build Status](http://img.shields.io/travis/bem/bem-naming.svg?branch=master&style=flat)](https://travis-ci.org/bem/bem-naming) [![Coverage Status](https://img.shields.io/coveralls/bem/bem-naming.svg?branch=master&style=flat)](https://coveralls.io/r/bem/bem-naming) [![devDependency Status](http://img.shields.io/david/dev/bem/bem-naming.svg?style=flat)](https://david-dm.org/bem/bem-naming#info=devDependencies)

About
-----

This tool allows getting information about BEM-entity using [string](#string-representation) as well as forming string representation based on [BEM-naming](#bem-naming).

String representation
---------------------
To define BEM-entities we often use a special string format that allows us 100% define what entity exactly is represented.

According to original BEM-naming convention it looks like the following:

```js
'block[_block-mod-name[_block-mod-val]][__elem-name[_elem-mod-name[_elem-mod-val]]]'
```

*(Parameters whithin square brackets are optional)*

* Block — `block-name`.
* Block's modifier in key-value format — `block-name_mod-name_mod-val`.
* Block's boolean modifier — `block-name_mod`.
* Block's element — `block-name__elem-name`.
* Element's modifier in key-value format — `block-name__elem-name_mod-name_mod-val`.
* Element's boolean modifier — `block-name__elem_mod`.

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

BEM-naming
----------

BEM-entities can be defined with a help of js-object with the following fields:

* `block` — block's name. The field is required because block is the only independent BEM-entity.
* `elem` — element's name.
* `modName` — modifier's name.
* `modVal` — modifier's value.

API
---

* [`validate(str)`](#validatestr)
* [`parse(str)`](#parsestr)
* [`stringify(obj)`](#stringifyobj)
* [`isBlock(str)`](#isblockstr)
* [`isBlock(obj)`](#isblockobj)
* [`isBlockMod(str)`](#isblockmodstr)
* [`isBlockMod(obj)`](#isblockmodobj)
* [`isElem(str)`](#iselemstr)
* [`isElem(obj)`](#iselemobj)
* [`isElemMod(str)`](#iselemmodstr)
* [`isElemMod(obj)`](#iselemmodobj)

### `validate(str)`

Checks a string to be valid BEM notation.

Example:

```js
bemNaming.validate('block-name');  // true
bemNaming.validate('^*^');         // false
```

<hr/>

### `parse(str)`

It parses string `str` into BEM-naming.

Example:

```js
bemNaming.parse('block__elem_mod_val');  // { block: 'block', elem: 'elem',
                                         //   modName: 'mod', modVal: 'val' }
```

<hr/>

### `stringify(obj)`

It forms a string according to BEM-naming `obj`.

Example:

```js
bemNaming.stringify({
    block: 'block', elem: 'elem',
    modName: 'mod', modVal: 'val'
}); // 'block__elem_mod_val'
```

<hr/>

### `isBlock(str)`

Checks whether string `str` is a block.

Example:

```js
bemNaming.isBlock('block-name');   // true
bemNaming.isBlock('block__elem');  // false
```

<hr/>

### `isBlock(obj)`

Checks whether BEM-naming `obj` is a block.

Example:

```js
bemNaming.isBlock({ block: 'block-name' });           // true
bemNaming.isBlock({ block: 'block', elem: 'elem' });  // false
```

<hr/>

### `isBlockMod(str)`

Checks whether string `str` is modifier of a block.

Example:

```js
bemNaming.isBlockMod('block_mod');        // true
bemNaming.isBlockMod('block__elem_mod');  // false
```

<hr/>

### `isBlockMod(obj)`

Checks whether BEM-naming `obj` is modifier of a block.

Example:

```js
bemNaming.isBlockMod({ block: 'block',
    modName: 'mod', modVal: true });  // true

bemNaming.isBlockMod({ block: 'block', elem: 'elem',
    modName: 'mod', modVal: true });  // false
```

<hr/>

### `isElem(str)`

Checks whether string `str` is element of a block.

Example:

```js
bemNaming.isElem('block__elem');  // true
bemNaming.isElem('block-name');   // false
```

<hr/>

### `isElem(obj)`

Checks whether BEM-naming `obj` is element of a block.

Example:

```js
bemNaming.isElem({ block: 'block', elem: 'elem' });  // true
bemNaming.isElem({ block: 'block-name' });           // false
```

<hr/>

### `isElemMod(str)`

Checks whether string `str` is modifier of an element.

Example:

```js
bemNaming.isElemMod('block__elem_mod');  // true
bemNaming.isElemMod('block__elem');      // false
```

<hr/>

### `isElemMod(obj)`

Checks whether BEM-naming `obj` is modifier of an element.

Example:

```js
bemNaming.isElemMod({ block: 'block', elem: 'elem',
    modName: 'mod', modVal: true });  // true

bemNaming.isElemMod({ block: 'block',
    modName: 'mod', modVal: true});   // false
```

Custom naming convention
------------------------

To use your own naming convention to define strings that represent BEM-entities we need to create instance of `BEMNaming`-class.

Constructor `BEMNaming` gets the object from the following options:

* **String** `modSeparator` — separates names and values of modifiers from blocks and elements. Default&nbsp;as&nbsp;`_`.
* **String** `elemSeparator` — separates element's name from block. Default&nbsp;as&nbsp;`__`.
* **String** `literal` — defines which symbols can be used for block, element and modifier's names. Default&nbsp;as&nbsp;`[a-zA-Z0-9-]`.

Example:

```js
var BEMNaming = bemNaming.BEMNaming;
var myNaming = new BEMNaming({
    elemSeparator: '-',
    modSeparator: '--',
    literal: '[a-zA-Z0-9]'        // because element and modifier's separators include
});                               // hyphen in it, we need to exclude it from block,
                                  // element and modifier's name
                                
myNaming.parse('block--mod');     // { block: 'block',
                                  //   modName: 'mod', modVal: true }

myNaming.stringify({              // 'blockName-elemName--boolElemMod'
    block: 'blockName',
    elem: 'elemName',
    modName: 'boolElemMod'
});
```

