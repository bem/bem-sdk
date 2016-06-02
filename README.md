bem-entity-name
===============

[![NPM Status][npm-img]][npm]
[![Travis Status][test-img]][travis]
[![Coverage Status][coverage-img]][coveralls]

[npm]:          https://www.npmjs.org/package/bem-entity-name
[npm-img]:      https://img.shields.io/npm/v/bem-entity-name.svg

[travis]:       https://travis-ci.org/bem-sdk/bem-entity-name
[test-img]:     https://img.shields.io/travis/bem-sdk/bem-entity-name.svg

[coveralls]:    https://coveralls.io/r/bem-sdk/bem-entity-name
[coverage-img]: https://img.shields.io/coveralls/bem-sdk/bem-entity-name.svg

[david]:          https://david-dm.org/bem-sdk/bem-entity-name
[dependency-img]: http://img.shields.io/david/bem-sdk/bem-entity-name.svg

Install
-------

```
$ npm install --save bem-entity-name
```

Usage
-----

```js
import BemEntity from 'bem-entity-name';

const entity = new BemEntity({ block: 'button', elem: 'text' });

console.log(entity.block); // button
console.log(entity.elem);  // text
console.log(entity.mod);   // undefined

console.log(entity.id);   // button__elem
console.log(entity.type); // elem

console.log(entity.isEqual({ block: 'button' }));               // false
console.log(entity.isEqual({ block: 'button', elem: 'text' })); // true
```

License
-------

Code and documentation © 2016 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
