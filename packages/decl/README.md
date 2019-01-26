# decl

The library contains a number of methods to work with sets of [BEM-entities](https://en.bem.info/methodology/key-concepts/#bem-entity), aka BEMDECL files.

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.org/package/@bem/sdk.decl
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.decl.svg

## Requirements

* [Node.js 4+](https://nodejs.org/en/)

## Installation

This library is distributed on `npm`. In order to add it as a dependency, run the following command in your project directory:

```bash
npm install --save @bem/sdk.decl
```

> **Note** Node comes with npm installed so you should have a version of npm.

## Usage

```js
const bemDecl = require('@bem/sdk.decl');

// Since we using sets stored in files we need to load them asynchronously
async function() {
    // Await loading of file and put it to `set1` variable
    // Note: There are few formats of declaration files but bemDecl here to read them all
    const set1 = await bemDecl.load('set1.bemdecl.js');
    // File set1.bemdecl.js:
    // → exports.blocks = [
    // →     {name: 'button', elems: [{name: 'control'}, {name: 'icon'}]}
    // → ];

    // `set1` is an array of BemCell objects,
    // convert them to strings using `.map` and special `id` property:
    set1.map(c => c.id);
    // → [ 'button', 'button__control', 'button__icon' ]

    // Let's load another set:
    const set2 = await bemDecl.load('set2.bemdecl.js');
    // File set2.bemdecl.js:
    // → exports.deps = [
    // →     {block: 'button', elem: 'icon'},
    // →     {block: 'link', mods: {theme: 'normal'}}
    // → ];

    set2.map(c => c.id);
    // → [ 'button__icon', 'link', 'link_theme', 'link_theme_normal' ]

    // To subtract one set from another just use `.subtract` method:
    bemDecl.subtract(set1, set2).map(c => c.id);
    // → [ 'button', 'button__control' ]

    // Result will be different if we swap arguments (as expected):
    bemDecl.subtract(set2, set1).map(c => c.id);
    // → [ 'link', 'link_theme', 'link_theme_normal' ]

    // To merge two sets use `.merge` method:
    bemDecl.merge(set1, set2).map(c => c.id);
    // → [ 'button', 'button__control', 'button__icon',
    // →   'link', 'link_theme', 'link_theme_normal' ]

    // Also there is `.intersect` method to calculate intersection between them:
    bemDecl.intersect(set1, set2).map(c => c.id);
    // → [ 'button__icon' ]
}
```

## BEMDECL formats

There are several formats:

* **'v1'** — the old [BEMDECL](https://en.bem.info/methodology/declarations/) format, also known as `exports.blocks = [ /* ... */ ]`.
* **'v2'** — the format based on [`deps.js`](https://en.bem.info/platform/deps/)-files, also known as `exports.deps = [ /* ... */ ]`.
* **'enb'** — the legacy format for widely used enb deps reader.

> **Note** `bem-decl` controls all of them.

## API

* [load()](#load-method)
* [save()](#save-method)
* [merge()](#merge-method)
* [intersect()](#intersect-method)
* [subtract()](#subtract-method)
* [parse()](#parse-method)
* [stringify()](#stringify-method)

### format()

Formats a normalized declaration to the target [format](#bemdecl-formats).

```js
/**
 * @param  {Array|Object} decl — Normalized declaration.
 * @param  {Object} [opts] — Additional options.
 * @param  {string} opts.format — Target format.
 * @return {Array} — Array with converted declaration.
 */
format(decl, opts)
```

### load()

Loads BEM cells from a file in any. This method reads file and calls the [parse()](#parse) function on its content.

```js
/**
 * @param  {string} filePath — Path to bemdecl.js file.
 * @param  {Object|string} opts — Additional options.
 * @return {Promise} — A promise that represents `BemCell[]`.
 */
format(filePath)
```

You can pass additional options that are used in the [readFile()]((https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback)) method from the Node.js File System..

**Example:**

```js
bemDecl.load('set1.bemdecl.js')
    .then(decl => {
        // Work with declaration
    });
```

### save()

Formats and saves a file with BEM cells from a file in any format

```js
/**
 * @param   {String} filename — File path to save the declaration.
 * @param   {BemCell[]} cells  — Set of BEM cells to save.
 * @param   {Object} [opts] —Additional options.
 * @returns {Promise.<undefined>} — A promise resolved when file was stored.
 */
```

You can pass additional options that are used in the methods:
* [stringify()](#stringify) method from this package.
* [writeFile()](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback) method from the Node.js File System.

Read more about additional options for the `writeFile()` method in the Node.js File System [documentation](https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback).

**Example:**

```js
const decl = [
    new BemCell({ entity: new BemEntityName({ block: 'button' }) })
];
bemDecl.save('set1.bemdecl.js', decl, { format: 'enb' })
    .then(() => {
        console.log('saved');
    });
```

### merge()

Merges many sets of BEM cells into one set. [Read more](https://en.bem.info/methodology/declarations/#adding-declarations)

```js
/**
 * @param {BemCell[]} set - Original set of cells.
 * @param {...(BemCell[])} otherSet - Set (or sets) of that should be merged into the original one.
 * @returns {BemCell[]} - Resulting set of cells.
 */
merge(set, otherSet, ...)
```

**Example:**

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

// → ['button', 'link']
```

### intersect()

Calculates the set of BEM cells that exists in each passed set. [Read more](https://en.bem.info/methodology/declarations/#intersecting-declarations).

```js
/**
 * @param {BemCell[]} set - Original set of cells.
 * @param {...(BemCell[])} otherSet - Set (or sets) of that should be merged into the original one.
 * @returns {BemCell[]} - Resulting set of cells.
 */
intersect(set, otherSet, ...)
```

**Example:**

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

// → ['button']
```

### subtract()

Calculates the set of BEM cells that occur only in the first passed set and does not exist in the rest. [Read more](https://en.bem.info/methodology/declarations/#subtracting-declarations).

```js
/**
 * Subtracting sets of cells.
 *
 * @param {BemCell[]} set - Original set of cells.
 * @param {...(BemCell[])} removingSet - Set (or sets) with cells that should be removed.
 * @returns {BemCell[]} - Resulting set of cells.
 */
subtract(set, removingSet, ...)
```

**Example:**

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

// → ['button']
```

### parse()

Parses raw string or evaluated JS object to a set of BEM cells.

```js
/**
 * @param {String|Object} bemdecl - String of bemdecl or object.
 * @returns {Array<BemCell>} — Set of BEM cells.
 */
parse(bemdecl)
```

**Example:**

```js
bemDecl.parse('exports.deps = [{ block: "button" }]').map(c => c.id);

// → ['button']
```

See also [Declarations in BEM](https://en.bem.info/methodology/declarations/).

### stringify()

Stringifies a set of BEM cells to a specific format.

**Note** Temporary there is just `enb` format. It will be fixed later.

```js
/**
 * @param {BemCell|BemCell[]} decl - Source declaration.
 * @param {Object} opts - Additional options.
 * @param {String} opts.format - Format of the output (v1, v2, enb).
 * @param {String} [opts.exportType=json5] - Defines how to wrap result (commonjs, json5, json, es6|es2015).
 * @param {String|Number} [opts.space] - Number of space characters or string to use as a white space (exactly as in JSON.stringify).
 * @returns {String} — String representation of declaration.
 */
stringify(decl, options)
```

**Example:**

```js
const decl = [
    new BemCell({ entity: new BemEntityName({ block: 'button' }) })
];

bemDecl.stringify(decl, { format: 'enb', exportType: 'commonjs' });
 
// → module.exports = {
// →     "format": "enb",
// →     "decl": [
// →         {
// →             "block": "block"
// →         }
// →     ]
// → };
```

### assign()

Fills entity fields from with the scope ones.

This method gets all fields from

```js
/**
 * @typedef BemEntityName
 * @property {string} block — Block name.
 * @property {string} [elem] — Element name.
 * @property {string|Object} [mod] — Modifier name or object with name and value.
 * @property {string} mod.name — Modifier name.
 * @property {string} [mod.val=true] — Modifier value.
 */

/**
 * @param {Object} cell - Incoming fields of the BEM cell.
 * @param {BemEntityName} [cell.entity] — BEM entity name fields.
 * @param {string} [cell.tech] — Field, that specify technology.
 * @param {BemCell} scope - Context, the processing entity usually
 * @returns {BemCell} - Filled entity and tech
 */
assign(cell, scope)
```

**Example:**

```js

```

### normalize()



## Contributing

Please read [CONTRIBUTING.md](https://github.com/bem/bem-sdk/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/bem/bem-sdk/tree/master/packages/decl/tags).

## Authors

* **Andrew Abramov** (*Initial work* — [blond](https://github.com/blond)).

> See also the full list of [contributors](https://github.com/bem/bem-sdk/contributors) who participated in this project.

You may also get it with `git log --pretty=format:"%an <%ae>" | sort -u`.

## License

Code and documentation copyright © 2014-2017 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
