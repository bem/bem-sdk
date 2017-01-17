# bemjson-to-decl

Easy to use BEMJSON to set of BEM-entities (aka BEMDECL) converter written in JS

[![NPM Status][npm-img]][npm]
[![Travis Status][test-img]][travis]
[![Coverage Status][coverage-img]][coveralls]
[![Dependency Status][david-img]][david]

[npm]:          https://www.npmjs.org/package/bemjson-to-decl
[npm-img]:      https://img.shields.io/npm/v/bemjson-to-decl.svg
[travis]:       https://travis-ci.org/bem-sdk/bemjson-to-decl
[test-img]:     https://img.shields.io/travis/bem-sdk/bemjson-to-decl.svg?label=tests
[coveralls]:    https://coveralls.io/r/bem-sdk/bemjson-to-decl
[coverage-img]: https://img.shields.io/coveralls/bem-sdk/bemjson-to-decl.svg
[david]:        https://david-dm.org/bem-sdk/bemjson-to-decl
[david-img]:    https://img.shields.io/david/bem-sdk/bemjson-to-decl.svg

## Prerequisites

- [Node.js](https://nodejs.org/en/) 4.x+

## Installing

Run in your project:
```sh
npm install --save bemjson-to-decl
```

## Usage

```js
const bemjsonToDecl = require('bemjson-to-decl');

bemjsonToDecl.convert([
    {elem: 'control', elemMods: {theme: 'normal'}},
    {elem: 'control', elemMods: {theme: 'ghost'}}
], {block: 'button'});
// [ { block: 'button' },
//   { block: 'button', elem: 'control' },
//   { block: 'button', elem: 'control', modName: 'theme', modVal: true },
//   { block: 'button', elem: 'control', modName: 'theme', modVal: 'normal' },
//   { block: 'button', elem: 'control', modName: 'theme', modVal: 'ghost' } ]
```

## API

### `convert(bemjson: BEMJSON, scope: ?BemEntityName): BemCell[]`

Fetchs BEM-entities from BEMJSON object.

```js
const bemjsonToDecl = require('bemjson-to-decl');

bemjsonToDecl.convert({block: 'button', mods: {theme: 'normal'}});
// [ { block: 'button' },
//   { block: 'button', modName: 'theme', modVal: true },
//   { block: 'button', modName: 'theme', modVal: 'normal' } ]
```

### `stringify(bemjson: BEMJSON, scope: ?BemEntityName, opts: ?{indent: string}): string`

Fetchs BEM-entities and stringifies result to the string.

```js
const bemjsonToDecl = require('bemjson-to-decl');

bemjsonToDecl.stringify({block: 'button'}, null, {indent: '\t'});
// "[\n\t{\n\t\tblock: 'button'\n\t}\n]"
```

## Contributing

Please read [CONTRIBUTING.md](https://github.com/bem-sdk/bem-sdk/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/bem-sdk/bemjson-to-decl/tags).

## Authors

* **Vladimir Grinenko** - *Initial work* - [tadatuta](https://github.com/tadatuta)

See also the full list of [contributors](https://github.com/bem-sdk/bemjson-to-decl/contributors) who participated in this project.

You may also get it with `git log --pretty=format:"%an <%ae>" | sort -u`.

## License

Code and documentation are licensed under the Mozilla Public License 2.0 - see the [LICENSE.md](LICENSE.md) file for details.

<!--
## Acknowledgments
-->
