bem-import-notation
===================

Tool for working with BEM import strings.

[![NPM Status][npm-img]][npm]
[![Travis Status][test-img]][travis]
[![Coverage Status][coverage-img]][coveralls]
[![Dependency Status][dependency-img]][david]

[npm]:            https://www.npmjs.org/package/@bem/import-notation
[npm-img]:        https://img.shields.io/npm/v/@bem/import-notation.svg

[travis]:         https://travis-ci.org/bem-sdk/bem-import-notation
[test-img]:       https://img.shields.io/travis/bem-sdk/bem-import-notation.svg?label=tests

[coveralls]:      https://coveralls.io/r/bem-sdk/bem-import-notation
[coverage-img]:   https://img.shields.io/coveralls/bem-sdk/bem-import-notation.svg

[david]:          https://david-dm.org/bem-sdk/bem-import-notation
[dependency-img]: http://img.shields.io/david/bem-sdk/bem-import-notation.svg


Extract [bem-entities](https://en.bem.info/methodology/key-concepts/#bem-entity) from bem-import strings.

Install
-------

```sh
npm install --save @bem/import-notation
```

Usage
-----

```js
import {parse} from '@bem/import-notation';

parse('b:button e:text') // [ { block : 'button', elem : 'text' } ]

parse('b:button m:theme=normal|action') // [ { block : 'button' },
                                          // { block : 'button', mod : { name: 'theme' } },
                                          // { block : 'button', mod : { name: 'theme', val : 'normal' } },
                                          // { block : 'button', mod : { name: 'theme', val : 'action' } } ]
```

ToC:

* [API](#api)
* [notation](#notation)


API
---

### parse(str, ctx)

Parameter | Type     | Description
----------|----------|--------------------------------------------------------
`str`     | `string` | BEM import notation check notation [section](#notation)
`ctx`     | `object` | BEM entity name representation.

Parses the string into bem entities.

Example:

```js
var entity = parse('b:button e:text')[0];
entity.block // 'button'
entity.elem // 'text'
```

#### ctx

Context allows to extract portion of entities.

```js
var enties = parse('m:theme=normal', { block: 'button' });

// [ { block: 'button', mod: { name: 'theme' } },
// { block: 'button', mod: { name: 'theme', val: 'normal' } } ]
```

Note that, using context exludes `{ block: 'button'}` from result.

So `parse('m:theme=normal', { block: 'button' })` is not same as `parse('b:button m:theme=normal')`

Notation
--------

This section describes all possible syntax of bem-import strings. 
Examples are provided in es6 syntax. Note that [parse](#api) function only works with strings.

Order of fields is important:

1. `b:`
1. `e:`
1. `m:`
1. `t:`

### block

```js
import 'b:button';
```

#### block with simple modifier

```js
import 'b:popup m:autoclosable';
```

#### block with modifier

```js
import 'b:button m:theme=active';
```

#### block with several modifiers
```js
import 'b:button m:theme=active m:size=m';
```

#### block with modifier that has several values
```js
import 'b:button m:theme=normal|active';
```

### element

```js
import 'b:button e:text';
```

#### element with simple modifier

```js
import 'b:popup e:tail m:autoclosable';
```

#### block with modifier

```js
import 'b:button e:text m:theme=active';
```

#### block with several modifiers
```js
import 'b:button e:text m:theme=active m:size=m';
```

#### block with modifier that has several values
```js
import 'b:button e:text m:theme=normal|active';
```

### technology

Technology is abstraction for extension on file system.

To extract bem-entities with special technology specify field `t:`.

```js
import 'b:button t:css';

import 'b:button m:theme=active t:css';

import 'b:button e:text m:theme=normal|active t:css';
```

License
-------

Code and documentation copyright 2014 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
