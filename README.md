bem-deps
========

[![Build Status](http://img.shields.io/travis/bem-incubator/bem-deps/master.svg?style=flat&label=tests)](https://travis-ci.org/bem/bem-deps)
[![Build status](http://img.shields.io/appveyor/ci/blond/bem-deps.svg?style=flat&label=windows)](https://ci.appveyor.com/project/blond/bem-deps)
[![Coverage Status](https://img.shields.io/coveralls/bem-incubator/bem-deps.svg?branch=master&style=flat)](https://coveralls.io/r/bem-incubator/bem-deps)
[![Dependency Status](http://img.shields.io/david/bem-incubator/bem-deps.svg?style=flat)](https://david-dm.org/bem-incubator/bem-deps)

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
