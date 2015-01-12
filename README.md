bem-naming
==========

[![NPM version](http://img.shields.io/npm/v/bem-naming.svg?style=flat)](http://www.npmjs.org/package/bem-naming) [![Download](http://img.shields.io/badge/download-1%20kB-blue.svg?style=flat)](https://github.com/bem/bem-naming/releases/v0.5.1) [![Build Status](http://img.shields.io/travis/bem/bem-naming/master.svg?style=flat)](https://travis-ci.org/bem/bem-naming) [![Coverage Status](https://img.shields.io/coveralls/bem/bem-naming.svg?branch=master&style=flat)](https://coveralls.io/r/bem/bem-naming) [![devDependency Status](http://img.shields.io/david/dev/bem/bem-naming.svg?style=flat)](https://david-dm.org/bem/bem-naming#info=devDependencies)

About
-----

This tool allows getting information about BEM entity using [string](#string-representation) as well as forming string representation based on [BEM-naming](#bem-naming).

String representation
---------------------
To define BEM entities we often use a special string format that allows us 100% define what entity exactly is represented.

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

BEM entities can be defined with a help of js-object with the following fields:

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

* [`validate(str)`](#validatestr)
* [`parse(str)`](#parsestr)
* [`stringify(obj)`](#stringifyobj)
* [`typeOf(str)`](#typeofstr)
* [`typeOf(obj)`](#typeofobj)
* [`isBlock(str)`](#isblockstr)
* [`isBlock(obj)`](#isblockobj)
* [`isBlockMod(str)`](#isblockmodstr)
* [`isBlockMod(obj)`](#isblockmodobj)
* [`isElem(str)`](#iselemstr)
* [`isElem(obj)`](#iselemobj)
* [`isElemMod(str)`](#iselemmodstr)
* [`isElemMod(obj)`](#iselemmodobj)
* [`elemDelim`](#elemdelim)
* [`modDelim`](#moddelim)

### `validate(str)`

Checks a string to be valid BEM notation.

Example:

```js
bemNaming.validate('block-name');  // true
bemNaming.validate('^*^');         // false
```

-------------------------------------------------------------------------------

### `parse(str)`

It parses string `str` into BEM-naming.

Example:

```js
bemNaming.parse('block__elem_mod_val');  // { block: 'block', elem: 'elem',
                                         //   modName: 'mod', modVal: 'val' }
```

-------------------------------------------------------------------------------

### `stringify(obj)`

It forms a string according to BEM-naming `obj`.

Example:

```js
bemNaming.stringify({
    block: 'block', elem: 'elem',
    modName: 'mod', modVal: 'val'
}); // 'block__elem_mod_val'
```

-------------------------------------------------------------------------------

### `typeOf(str)`

Returns a string indicating the type of the BEM entity.

Example:

```js
bemNaming.typeOf('block');             // block
bemNaming.typeOf('block_mod');         // blockMod
bemNaming.typeOf('block__elem');       // elem
bemNaming.typeOf('block__elem_mod');   // elemMod
```

-------------------------------------------------------------------------------

### `typeOf(obj)`

Returns a string indicating the type of the BEM entity.

Example:

```js
bemNaming.isBlock({ block: 'block' });                 // block
bemNaming.isBlock({ block: 'block', modName: 'mod' }); // blockMod
bemNaming.isBlock({ block: 'block', elem: 'elem' });   // elem
bemNaming.isBlock({ block: 'block', elem: 'elem' });   // elemMod
```

-------------------------------------------------------------------------------

### `isBlock(str)`

Checks whether string `str` is a block.

Example:

```js
bemNaming.isBlock('block-name');   // true
bemNaming.isBlock('block__elem');  // false
```

-------------------------------------------------------------------------------

### `isBlock(obj)`

Checks whether BEM-naming `obj` is a block.

Example:

```js
bemNaming.isBlock({ block: 'block-name' });           // true
bemNaming.isBlock({ block: 'block', elem: 'elem' });  // false
```

-------------------------------------------------------------------------------

### `isBlockMod(str)`

Checks whether string `str` is modifier of a block.

Example:

```js
bemNaming.isBlockMod('block_mod');        // true
bemNaming.isBlockMod('block__elem_mod');  // false
```

-------------------------------------------------------------------------------

### `isBlockMod(obj)`

Checks whether BEM-naming `obj` is modifier of a block.

Example:

```js
bemNaming.isBlockMod({ block: 'block',
    modName: 'mod', modVal: true });  // true

bemNaming.isBlockMod({ block: 'block', elem: 'elem',
    modName: 'mod', modVal: true });  // false
```

-------------------------------------------------------------------------------

### `isElem(str)`

Checks whether string `str` is element of a block.

Example:

```js
bemNaming.isElem('block__elem');  // true
bemNaming.isElem('block-name');   // false
```

-------------------------------------------------------------------------------

### `isElem(obj)`

Checks whether BEM-naming `obj` is element of a block.

Example:

```js
bemNaming.isElem({ block: 'block', elem: 'elem' });  // true
bemNaming.isElem({ block: 'block-name' });           // false
```

-------------------------------------------------------------------------------

### `isElemMod(str)`

Checks whether string `str` is modifier of an element.

Example:

```js
bemNaming.isElemMod('block__elem_mod');  // true
bemNaming.isElemMod('block__elem');      // false
```

-------------------------------------------------------------------------------

### `isElemMod(obj)`

Checks whether BEM-naming `obj` is modifier of an element.

Example:

```js
bemNaming.isElemMod({ block: 'block', elem: 'elem',
    modName: 'mod', modVal: true });  // true

bemNaming.isElemMod({ block: 'block',
    modName: 'mod', modVal: true});   // false
```

-------------------------------------------------------------------------------

### `elemDelim`

String to separate elem from block.

-------------------------------------------------------------------------------

### `modDelim`

String to separate names and values of modifiers from blocks and elements.

Custom naming convention
------------------------

Use `bemNaming` function to create instance to manage naming of your own naming convention.

Function `bemNaming` gets the object from the following options:

* **String** `elem` — separates element's name from block. Default&nbsp;as&nbsp;`__`.
* **String** `mod` — separates names and values of modifiers from blocks and elements. Default&nbsp;as&nbsp;`_`.
* **String** `wordPattern` — defines which symbols can be used for block, element and modifier's names. Default&nbsp;as&nbsp;`[a-z0-9]+(?:-[a-z0-9]+)*`.

Example:

```js
var myNaming = bemNaming({
    elem: '-',
    mod: '--',
    wordPattern: '[a-zA-Z0-9]+'   // because element and modifier's separators include
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

Convention by Harry Roberts
---------------------------

According to this convention elements are delimited with two underscores (__), and boolean modifiers are delimited by two hyphens (--).
Key-value modifiers are not used.

Read more in the [Guidelines](http://cssguidelin.es/#bem-like-naming).

Example:

```js
var csswizardry = bemNaming({
    elem: '__',
    mod: '--'
});

csswizardry.parse('block__elem'); // { block: 'block', elem: 'elem' }
csswizardry.parse('block--mod');  // { block: 'block',
                                  //   modName: 'mod', modVal: true }

csswizardry.stringify({           // 'block__elem--mod'
    block: 'block',
    elem: 'elem',
    modName: 'mod'
});
```

License
-------

Code and documentation copyright 2014 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
