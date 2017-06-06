bem-deps
========

[![NPM Status][npm-img]][npm]
[![Travis Status][test-img]][travis]
[![Windows Status][appveyor-img]][appveyor]
[![Coverage Status][coverage-img]][coveralls]
[![Dependency Status][david-img]][david]

[npm]:          https://www.npmjs.org/package/@bem/deps
[npm-img]:      https://img.shields.io/npm/v/@bem/deps.svg

[travis]:       https://travis-ci.org/bem-sdk/bem-deps
[test-img]:     https://img.shields.io/travis/bem-sdk/bem-deps.svg?label=tests

[appveyor]:     https://ci.appveyor.com/project/blond/bem-deps
[appveyor-img]: http://img.shields.io/appveyor/ci/blond/bem-deps.svg?style=flat&label=windows

[coveralls]:    https://coveralls.io/r/bem-sdk/bem-deps
[coverage-img]: https://img.shields.io/coveralls/bem-sdk/bem-deps.svg

[david]:        https://david-dm.org/bem-sdk/bem-deps
[david-img]:    http://img.shields.io/david/bem-sdk/bem-deps.svg?style=flat

Install
-------

```
$ npm install --save-dev @bem/deps
```

Usage
-----

```js
var bemDeps = require('@bem/deps'),
    toArray = require('stream-to-array');

toArray(bemDeps.load({ levels: ['blocks'] }), function (err, relations) {
    var declaration = [{ block: 'a' }],
        res = bemDeps.resolve(declaration, relations, { tech: 'js' });

    console.log(JSON.stringify(res, null, 4));
});

// {
//     "entities": [
//         { "block": "c" },
//         { "block": "a" },
//         { "block": "b" }
//     ],
//     "dependOn": [
//         {
//             "tech": "bemhtml",
//             "entities": [
//                 { "block": "d" }
//             ]
//         }
//     ]
// }
```

License
-------

Code and documentation copyright 2015 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
