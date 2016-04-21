bem-walk
========

[![NPM Status][npm-img]][npm]
[![Travis Status][test-img]][travis]
[![Windows Status][appveyor-img]][appveyor]
[![Coverage Status][coverage-img]][coveralls]
[![Dependency Status][coverage-img]][coveralls]

[npm]:          https://www.npmjs.org/package/bem-walk
[npm-img]:      https://img.shields.io/npm/v/bem-walk.svg

[travis]:       https://travis-ci.org/bem-sdk/bem-walk
[test-img]:     https://img.shields.io/travis/bem-sdk/bem-walk.svg?label=tests

[appveyor]:     https://ci.appveyor.com/project/blond/bem-walk
[appveyor-img]: http://img.shields.io/appveyor/ci/blond/bem-walk.svg?style=flat&label=windows

[coveralls]:    https://coveralls.io/r/bem-sdk/bem-walk
[coverage-img]: https://img.shields.io/coveralls/bem-sdk/bem-walk.svg

[david]:        https://david-dm.org/bem-sdk/bem-walk
[david-img]:    http://img.shields.io/david/bem/bem-walk.svg?style=flat

Install
-------

```
$ npm install --save-dev bem-walk
```

Usage
-----

```js
var walk = require('bem-walk'),
    stringify = require('JSONStream').stringify,
    config = {
        levels: {
            'lib/bem-core/common.blocks': { scheme: 'nested' },
            'lib/bem-core/desktop.blocks': { scheme: 'nested' },
            'common.blocks': { scheme: 'flat' },
            'desktop.blocks': { scheme: 'flat' }
        }
    };

walk([
    'libs/bem-core/common.blocks',
    'libs/bem-core/desktop.blocks',
    'common.blocks',
    'desktop.blocks'
], config)
    .pipe(stringify())
    .pipe(process.stdout);

// [{
//     entity: { block: "page" },
//     level: "libs/bem-core/desktop.blocks",
//     tech: "bemhtml",
//     path: "libs/bem-core/desktop.blocks/page/page.bemhtml"
// },
// ...
// ]
```

License
-------

Code and documentation copyright 2014 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
