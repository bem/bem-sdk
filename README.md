# bem-walk [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][depstat-image]][depstat-url]

Crawling levels on file system and emits [bem-objects](https://github.com/getbem/bem-object).

## Usage

```js
var walk = require('bem-walk');
var walker = walk(['common.blocks', 'desktop.blocks']);

walker.on('data', function (data) {
    // data is bem-object
});
```

## API

### walk(levels, [options])

Returns `Stream` with [bem-object](https://github.com/getbem/bem-object).

[npm-url]: https://npmjs.org/package/bem-walk
[npm-image]: http://img.shields.io/npm/v/bem-walk.svg?style=flat

[travis-url]: http://travis-ci.org/andrewblond/bem-walk
[travis-image]: http://img.shields.io/travis/andrewblond/bem-walk.svg?branch=master&style=flat

[depstat-url]: http://david-dm.org/andrewblond/bem-walk
[depstat-image]: http://img.shields.io/david/andrewblond/bem-walk.svg?style=flat

[coveralls-url]: https://coveralls.io/r/andrewblond/bem-walk
[coveralls-image]: http://img.shields.io/coveralls/andrewblond/bem-walk.svg?style=flat
