bem-entity
==========

[![NPM Status][npm-img]][npm]
[![Travis Status][test-img]][travis]
[![Coverage Status][coverage-img]][coveralls]

[npm]:          https://www.npmjs.org/package/bem-entity
[npm-img]:      https://img.shields.io/npm/v/bem-entity.svg

[travis]:       https://travis-ci.org/bem-sdk/bem-entity
[test-img]:     https://img.shields.io/travis/bem-sdk/bem-entity.svg

[coveralls]:    https://coveralls.io/r/bem-sdk/bem-entity
[coverage-img]: https://img.shields.io/coveralls/bem-sdk/bem-entity.svg

[david]:          https://david-dm.org/bem-sdk/bem-entity
[dependency-img]: http://img.shields.io/david/bem-sdk/bem-entity.svg

Install
-------

```
$ npm install --save bem-entity
```

Usage
-----

```js
import BemEntity from 'bem-entity';

const entity = new BemEntity({ block: 'button', elem: 'text' });

console.log(entity.block); // button
console.log(entity.elem);  // text

console.log(entity.id);   // button__elem
console.log(entity.type); // elem

console.log(entity.is({ block: 'button' }));               // false
console.log(entity.is({ block: 'button', elem: 'text' })); // true
```

License
-------

MIT © [Andrew Abramov](https://github.com/blond)
