bemjson-to-jsx
==============

Transforms BEMJSON objects to JSX markup.

[![NPM Status][npm-img]][npm]
[![Travis Status][test-img]][travis]
[![Coverage Status][coverage-img]][coveralls]
[![Dependency Status][dependency-img]][david]

[npm]:            https://www.npmjs.org/package/bemjson-to-jsx
[npm-img]:        https://img.shields.io/npm/v/bemjson-to-jsx.svg

[travis]:         https://travis-ci.org/bem-sdk/bemjson-to-jsx
[test-img]:       https://img.shields.io/travis/bem-sdk/bemjson-to-jsx.svg?label=tests

[coveralls]:      https://coveralls.io/r/bem-sdk/bemjson-to-jsx
[coverage-img]:   https://img.shields.io/coveralls/bem-sdk/bemjson-to-jsx.svg

[david]:          https://david-dm.org/bem-sdk/bemjson-to-jsx
[dependency-img]: http://img.shields.io/david/bem-sdk/bemjson-to-jsx.svg

Install
-------

```
$ npm install --save bemjson-to-jsx
```

Usage
-----

```js
const bemjsonToJSX = require('bemjson-to-jsx')();

var bemjson = {
    block: 'button2',
    mods: { theme: 'normal', size: 'm' },
    text: 'hello world'
};

var jsxTree = bemjsonToJSX.process(bemjson);

console.log(jsxTree.JSX));
// → "<Button2 theme={'normal'} size={'m'} text={'hello world'}/>"
```

