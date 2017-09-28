# bemjson-to-jsx

Transforms BEMJSON objects to JSX markup.

[![NPM Status][npm-img]][npm]

[npm]:            https://www.npmjs.org/package/@bem/sdk.bemjson-to-jsx
[npm-img]:        https://img.shields.io/npm/v/@bem/sdk.bemjson-to-jsx.svg

Install
-------

```
$ npm install --save @bem/sdk.bemjson-to-jsx
```

Usage
-----

```js
const bemjsonToJSX = require('@bem/sdk.bemjson-to-jsx')();

const bemjson = {
    block: 'button2',
    mods: { theme: 'normal', size: 'm' },
    text: 'hello world'
};

const jsxTree = bemjsonToJSX.process(bemjson);

console.log(jsxTree.JSX);
// → "<Button2 theme={'normal'} size={'m'} text={'hello world'}/>"
```
