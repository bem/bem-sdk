# import-notation

Tool for working with BEM import strings.

[![NPM Status][npm-img]][npm]

[npm]:            https://www.npmjs.org/package/@bem/sdk.import-notation
[npm-img]:        https://img.shields.io/npm/v/@bem/sdk.import-notation.svg

Extract [BEM entities] from import strings.

Installation
------------

```sh
npm install --save @bem/sdk.import-notation
```

Usage
-----

```js
import {parse} from '@bem/sdk.import-notation';

parse('b:button e:text'); // → [ { block : 'button', elem : 'text' } ]

parse('b:button m:theme=normal|action');

// → [ { block : 'button' },
//     { block : 'button', mod : { name: 'theme' } },
//     { block : 'button', mod : { name: 'theme', val : 'normal' } },
//     { block : 'button', mod : { name: 'theme', val : 'action' } } ]

```

API
---

* [parse](#parsestr-ctx)
* [stringify](#stringify)
* [expand](#parsestr-ctx)

### parse(str, ctx)

Parameter | Type     | Description
----------|----------|--------------------------------------------------------
`str`     | `string` | BEM import notation check [notation section](#notation)
`[ctx]`   | `object` | BEM entity name representation

Parses the string into BEM entities.

Example:

```js
var entity = parse('b:button e:text')[0];
entity.block // → 'button'
entity.elem // → 'text'
```

#### ctx

Context allows to use short form of notation.

```js
var enties = parse('m:theme=normal', { block: 'button' });

// → [ { block: 'button' },
//     { block: 'button', mod: { name: 'theme' } },
//     { block: 'button', mod: { name: 'theme', val: 'normal' } } ]
```

### stringify

Parameter | Type     | Description
----------|----------|------------------------------------------------------------------------------
`entities`| `array`  | Array of [BEM entities] to merge into import string [notation](#notation)

Forms a string from [BEM entities]. Be aware to merge only one type of entities.
The array should contains one block or one elem and optionally it's modifiers.

### expand(str, ctx)

Parameter | Type     | Description
----------|----------|--------------------------------------------------------
`str`     | `string` | BEM import notation check [notation section](#notation)
`ctx`     | `object` | BEM entity name representation

Expand notation string to full form by context BEM entity.

Example:

```js
var notation = parse('e:text', { block: 'button' });

// → 'b:button e:text'
```

Notation
--------

This section describes all possible syntax of BEM import strings.
Examples are provided in es6 syntax. Note that [parse](#parsestr-ctx) function only works with strings.

Right now order of fields is important, check [issue](https://github.com/bem-sdk-archive/bem-import-notation/issues/12):

1. `b:`
1. `e:`
1. `m:`
1. `t:`

### block

```js
import 'b:button';
// → [ { block: 'button' } ]
```

#### block with simple modifier

```js
import 'b:popup m:autoclosable';
// → [ { block: 'popup', mod: { name: 'autoclosable' } } ]
```

#### block with modifier

```js
import 'b:button m:theme=active';
// → [ { block: 'button', mod: { name: 'theme' } }
//     { block: 'button', mod: { name: 'theme', val: 'active' } } ]
```

#### block with several modifiers

```js
import 'b:button m:theme=active m:size=m';
// → [ { block: 'button' },
//     { block: 'button', mod: { name: 'theme' } },
//     { block: 'button', mod: { name: 'theme', val: 'active' } },
//     { block: 'button', mod: { name: 'size' } },
//     { block: 'button', mod: { name: 'size', val: 'm' } } ]
```

#### block with modifier that has several values

```js
import 'b:button m:theme=normal|active';
// → [ { block: 'button' },
//     { block: 'button', mod: { name: 'theme' } },
//     { block: 'button', mod: { name: 'theme', val: 'normal' } },
//     { block: 'button', mod: { name: 'theme', val: 'active' } } ]
```

### element

```js
import 'b:button e:text';
// → [ { block: 'button', elem: 'text' } ]
```

#### element with simple modifier

```js
import 'b:popup e:tail m:autoclosable';
// → [ { block: 'popup', elem: 'tail' },
//     { block: 'popup', elem: 'tail', mod: { name: 'autoclosable' } } ]
```

#### element with modifier

```js
import 'b:button e:text m:theme=active';
// → [ { block: 'button', elem: 'text' },
//     { block: 'button', elem: 'text', mod: { name: 'theme' } },
//     { block: 'button', elem: 'text', mod: { name: 'theme', val: 'active' } } ]
```

#### element with several modifiers

```js
import 'b:button e:text m:theme=active m:size=m';
// → [ { block: 'button', elem: 'text' },
//     { block: 'button', elem: 'text', mod: { name: 'theme' } },
//     { block: 'button', elem: 'text', mod: { name: 'theme', val: 'active' } },
//     { block: 'button', elem: 'text', mod: { name: 'size' } },
//     { block: 'button', elem: 'text', mod: { name: 'size', val: 'm' } } ]
```

#### element with modifier that has several values

```js
import 'b:button e:text m:theme=normal|active';
// → [ { block: 'button', elem: 'text' },
//     { block: 'button', elem: 'text', mod: { name: 'theme' } },
//     { block: 'button', elem: 'text', mod: { name: 'theme', val: 'normal' } },
//     { block: 'button', elem: 'text', mod: { name: 'theme', val: 'active' } } ]
```

### technology

Technology is abstraction for extension on file system. Check [docs](https://en.bem.info/methodology/key-concepts/#implementation-technology).

Specify field `t:` to extract BEM entities with concretele technology.

```js
import 'b:button t:css';
// → [ { block: 'button', tech: 'css' } ]

import 'b:button m:theme=active t:js';
// → [ { block: 'button', tech: 'js' },
//     { block: 'button', mod: { name: 'theme' }, tech: 'js' },
//     { block: 'button', mod: { name: 'theme', val: 'active' }, tech: 'js' } ]

import 'b:button e:text m:theme=normal|active t:css';
// → [ { block: 'button', elem: 'text', tech: 'css' },
//     { block: 'button', elem: 'text', mod: { name: 'theme' }, tech: 'css' },
//     { block: 'button', elem: 'text', mod: { name: 'theme', val: 'normal' }, tech: 'css' },
//     { block: 'button', elem: 'text', mod: { name: 'theme', val: 'active' }, tech: 'css' } ]
```

License
-------

Code and documentation copyright 2017 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).

[BEM entities]: https://en.bem.info/methodology/key-concepts/#bem-entity
