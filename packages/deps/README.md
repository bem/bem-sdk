# deps

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.org/package/@bem/sdk.deps
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.deps.svg

Install
-------

```sh
$ npm install --save-dev @bem/sdk.deps
```

Usage
-----

```js
var bemDeps = require('@bem/sdk.deps'),
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

Code and documentation copyright 2015-2017 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
