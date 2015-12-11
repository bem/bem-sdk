bem-walk
========

[![NPM version](http://img.shields.io/npm/v/bem-walk.svg?style=flat)](http://www.npmjs.org/package/bem-walk) [![Build Status](http://img.shields.io/travis/bem/bem-walk/master.svg?style=flat&label=tests)](https://travis-ci.org/bem/bem-walk) [![Build status](http://img.shields.io/appveyor/ci/blond/bem-walk.svg?style=flat&label=windows)](https://ci.appveyor.com/project/blond/bem-walk) [![Coverage Status](https://img.shields.io/coveralls/bem/bem-walk.svg?branch=master&style=flat)](https://coveralls.io/r/bem/bem-walk) [![Dependency Status](http://img.shields.io/david/bem/bem-walk.svg?style=flat)](https://david-dm.org/bem/bem-walk)

Install
-------

```
$ npm install --save-dev bem-walk@alpha
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
