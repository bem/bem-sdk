# bem-decl

Library with a couple of methods to work with sets of BEM entities (aka BEMDECL files).

[![NPM Status][npm-img]][npm]
[![Travis Status][test-img]][travis]
[![Coverage Status][coverage-img]][coveralls]
[![Dependency Status][david-img]][david]

[npm]:          https://www.npmjs.org/package/bem-decl
[npm-img]:      https://img.shields.io/npm/v/bem-decl.svg
[travis]:       https://travis-ci.org/bem-sdk/bem-decl
[test-img]:     https://img.shields.io/travis/bem-sdk/bem-decl.svg?label=tests
[coveralls]:    https://coveralls.io/r/bem-sdk/bem-decl
[coverage-img]: https://img.shields.io/coveralls/bem-sdk/bem-decl.svg
[david]:        https://david-dm.org/bem-sdk/bem-decl
[david-img]:    https://img.shields.io/david/bem-sdk/bem-decl.svg

## Prerequisites

- [Node.js](https://nodejs.org/en/) 4.x+

## Installation

Run in your project directory:
```sh
npm install --save bem-decl
```

## Usage

```js
const bemDecl = require('bem-decl');

// Since we using sets stored in files we need to load them asyncronously
async function() {
    // Await loading of file and put it to `set1` variable
    // NB: There are few formats of declaration files but bem-decl here to read them all
    const set1 = await bemDecl.load('set1.bemdecl.js');
    // File set1.bemdecl.js:
    // exports.blocks = [
    //     {name: 'button', elems: [{name: 'control'}, {name: 'icon'}]}
    // ];

    // `set1` is an array of BemCell objects,
    // convert them to strings using `.map` and special `id` property:
    set1.map(c => c.id);
    // [ 'button', 'button__control', 'button__icon' ]

    // Let's load another set:
    const set2 = await bemDecl.load('set2.bemdecl.js');
    // File set2.bemdecl.js:
    // exports.deps = [
    //     {block: 'button', elem: 'icon'},
    //     {block: 'link', mods: {theme: 'normal'}}
    // ];

    set2.map(c => c.id);
    // [ 'button__icon', 'link', 'link_theme', 'link_theme_normal' ]

    // To subtract one set from another just use `.subtract` method:
    bemDecl.subtract(set1, set2).map(c => c.id);
    // [ 'button', 'button__control' ]

    // Result will be different if we swap arguments (as expected):
    bemDecl.subtract(set2, set1).map(c => c.id);
    // [ 'link', 'link_theme', 'link_theme_normal' ]

    // To merge two sets use `.merge` method:
    bemDecl.merge(set1, set2).map(c => c.id);
    // [ 'button', 'button__control', 'button__icon',
    //   'link', 'link_theme', 'link_theme_normal' ]

    // Also there is `.intersect` method to calculate intersection between them:
    bemDecl.intersect(set1, set2).map(c => c.id);
    // [ 'button__icon' ]
}
```

## BEMDECL formats

There are several formats and `bem-decl` is here to rule them all.

- 'v1' - the old [BEMDECL](https://en.bem.info/methodology/declarations/) format also known as `exports.blocks = ...`.
- 'v2' - format based on [`deps.js`](https://en.bem.info/platform/deps/)-files also known as `exports.deps = ...`.
- 'enb' - legacy format for widely used enb deps reader.

## API

<!-- * [`save(file: String, decl: BemCell[], opts: *): Promise<?>`](#savefile-string-decl-bemcell-opts-promise) -->

* [`load(file: String, opts: *): Promise<BemCell[]>`](#loadfile-string-opts--promisebemcell)
* [`merge(BemCell[], BemCell[], ...): BemCell[]`](#mergebemcell-bemcell--bemcell)
* [`intersect(BemCell[], BemCell[], ...): BemCell[]`](#intersectbemcell-bemcell--bemcell)
* [`subtract(BemCell[], BemCell[]): BemCell[]`](#subtractbemcell-bemcell-bemcell)
* [`parse(bemdecl: String|Object): BemCell[]`](#parsebemdecl-stringobject-bemcell)
* [`stringify(BemCell[], {format: 'enb'}): String`](#stringifybemcell-format-enb-string)

### `load(file: String, opts: *): Promise<BemCell[]>`

Loads BEM entities from a file in any format

```js
bemDecl.load('set1.bemdecl.js')
    .then(decl => {
        // Work with declaration
    });
```

<!--
### `save(file: String, decl: BemCell[], opts: *): Promise<?>`

Formats and saves a file with BEM entities from a file in any format

```js
const decl = [
    new BemCell({ entity: new BemEntityName({ block: 'button' }) })
];
bemDecl.save('set1.bemdecl.js', decl, { format: 'enb' });
```

TODO: https://github.com/bem-sdk/bem-decl/issues/4
-->

### `merge(BemCell[], BemCell[], ...): BemCell[]`

Merges many sets of BEM entities into one

```js
const decl1 = [
    new BemCell({ entity: new BemEntityName({ block: 'button' }) })
];
const decl2 = [
    new BemCell({ entity: new BemEntityName({ block: 'link' }) })
];
const decl3 = [
    new BemCell({ entity: new BemEntityName({ block: 'button' }) }),
    new BemCell({ entity: new BemEntityName({ block: 'link' }) })
];
bemDecl.merge(decl1, decl2, decl3).map(c => c.id);
// [ 'button', 'link' ]
```

### `intersect(BemCell[], BemCell[], ...): BemCell[]`

Calculates the set of BEM entities that exists in each passed set

```js
const decl1 = [
    new BemCell({ entity: new BemEntityName({ block: 'button' }) }),
    new BemCell({ entity: new BemEntityName({ block: 'select' }) })
];
const decl2 = [
    new BemCell({ entity: new BemEntityName({ block: 'button' }) }),
    new BemCell({ entity: new BemEntityName({ block: 'link' }) })
];
const decl3 = [
    new BemCell({ entity: new BemEntityName({ block: 'button' }) }),
    new BemCell({ entity: new BemEntityName({ block: 'attach' }) })
];
bemDecl.intersect(decl1, decl2, decl3).map(c => c.id);
// [ 'button' ]
```

### `subtract(BemCell[], BemCell[]): BemCell[]`

Calculates the set of BEM entities that occure only in the first passed set and does not exist in the rest

```js
const decl1 = [
    new BemCell({ entity: new BemEntityName({ block: 'button' }) }),
    new BemCell({ entity: new BemEntityName({ block: 'select' }) }),
    new BemCell({ entity: new BemEntityName({ block: 'link' }) })
];
const decl2 = [
    new BemCell({ entity: new BemEntityName({ block: 'link' }) })
];
const decl3 = [
    new BemCell({ entity: new BemEntityName({ block: 'select' }) })
];
bemDecl.subtract(decl1, decl2, decl3).map(c => c.id);
// [ 'button' ]
```

### `parse(bemdecl: String|Object): BemCell[]`

Parses raw string or evaluated JS object to a set of BEM entities

```js
bemDecl.parse('exports.deps = [{ block: "button" }]').map(c => c.id);
// [ 'button' ]
```

See also [Declarations in BEM](https://en.bem.info/methodology/declarations/)

### `stringify(BemCell[], {format: 'enb'}): String`

Stringifies set of BEM entities to a specific format.

NB: Temporary there is just `enb` format. It will be fixed later.

```js
const decl = [
    new BemCell({ entity: new BemEntityName({ block: 'button' }) })
];
bemDecl.stringify(decl, { format: 'enb' });
// 'exports.deps = [\n    {\n        "block": "button"\n    }\n];\n'
```

## Contributing

Please read [CONTRIBUTING.md](https://github.com/bem-sdk/bem-sdk/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/bem-sdk/bem-decl/tags).

## Authors

* **Andrew Abramov** - *Initial work* - [blond](https://github.com/blond)

See also the full list of [contributors](https://github.com/bem-sdk/bem-decl/contributors) who participated in this project.

You may also get it with `git log --pretty=format:"%an <%ae>" | sort -u`.

## License

Code and documentation are licensed under the Mozilla Public License 2.0 - see the [LICENSE.md](LICENSE.md) file for details.

<!--
## Acknowledgments
-->
