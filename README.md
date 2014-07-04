bem-naming
==========

[![Bower version](https://badge.fury.io/bo/bem-naming.svg)](http://badge.fury.io/bo/bem-naming) [![NPM version](https://badge.fury.io/js/bem-naming.svg)](http://badge.fury.io/js/bem-naming) [![Build Status](https://travis-ci.org/bem/bem-naming.svg)](https://travis-ci.org/bem/bem-naming) [![Coverage Status](https://img.shields.io/coveralls/bem/bem-naming.svg?branch=master)](https://coveralls.io/r/bem/bem-naming) [![devDependency Status](https://david-dm.org/bem/bem-naming/dev-status.svg)](https://david-dm.org/bem/bem-naming#info=devDependencies)

About
-----

This tool allows getting information about BEM-entity using [string](#string-representation) as well as forming string representation based on [BEM-naming](#bem-naming).

String representation
---------------------
To define BEM-entities we often use a special string format that allows us 100% define what entity exactly is represented.

According to original BEM-naming convention it looks like the following:

```js
'block[_blockModName[_blockModVal]][__elemName[_elemModName[_elemModVal]]]'
```

*(Parameters whithin square brackets are optional)*

* Block — `block-name`.
* Block's modifier in key-value format — `block-name_mod-name_mod-val`.
* Block's boolean modifier — `block-name_mod`.
* Block's element — `block-name__elem-name`.
* Element's modifier in key-value format — `block-name__elem-name_mod-name_mod-val`.
* Element's boolean modifier — `block-name__elem_mod`.

BEM-naming
----------

BEM-entities can be defined with a help of js-object with the following fields:

* `block` — block's name. The field is required because block is the only independent BEM-entity.
* `elem` — element's name.
* `modName` — modifier's name.
* `modVal` — modifier's value.

API
---

* [`parse(str)`](#parsestr)
* [`stringify(obj)`](#stringifyobj)

### `parse(str)`

* **String** `str` — a string that defines BEM-entity.

It parses string `str` into [BEM-naming](#bem-naming).

Example:

```js
var naming = require('bem-naming');

naming.parse('block__elem_mod_val');  // { block: 'block', elem: 'elem',
                                      //   modName: 'mod', modVal: 'val' }
```

<hr/>

### `stringify(obj)`

* **String** `obj` — hash-object (BEM-naming) that defines BEM-entity.

It forms a string according to [BEM-naming](#bem-naming) `obj`.

Example:

```js
var naming = require('bem-naming');

naming.stringify({
    block: 'block', elem: 'elem',
    modName: 'mod', modVal: 'val'
}); // 'block__elem_mod_val'
```

Custom naming convention
------------------------

To use your own naming convention to define strings that represent BEM-entities we need to create instance of BEMNaming-class.

Constructor `BEMNaming` gets the object from the following options:

* **String** `modSeparator` — sepatates names and values of modifiers from blocks and elements. Default as `_`.
* **String** `elemSeparator` — separates element's name from block. Default as `__`.
* **String** `literal` — defines which symbols can be used as block, element and modifier's names. Default as `[a-zA-Z0-9-]`.

Example:

```js
var BEMNaming = require('bem-naming').BEMNaming;
var naming = new BEMNaming({
    elemSeparator: '-',
    modSeparator: '--',
    literal: '[a-zA-Z0-9]'      // because element and modifier's separators include
});                             // hyphen in it, we need to exclude it from block,
                                // element and modifier's name
                                
naming.parse('block--mod');     // { block: 'block',
                                //   modName: 'mod', modVal: true }

naming.stringify({              // 'blockName-elemName--boolElemMod'
    block: 'blockName',
    elem: 'elemName',
    modName: 'boolElemMod'
});
```

