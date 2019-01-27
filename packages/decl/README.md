# decl

Tool to work with [declarations in BEM](https://en.bem.info/methodology/declarations/).

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.org/package/@bem/sdk.decl
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.decl.svg

* [Introduction](#introduction)
* [Quickstart](#quickstart)
* [BEMDECL formats](#bemdecl-formats)
* [API](#api)
* [Contributing](#contributing)
* [Versioning](#versioning)
* [License](#license)

## Introduction

This tool contains number of methods to work with the declarations:

* Get declarations:
  * [Load](#load) declaration from a file.
  * [Parse](#parse) a string with declaration.
  * [Normalize](#normalize) declaration.
* Modify declarations:
  * [Subtract](#subtract) declarations.
  * [Intersect](#intersect) declarations.
  * [Merge](#merge) declarations (adding declarations).
* Save declarations:
  * [Save](#save) the declaration to a file.
  * [Make a string](#stringify) declaration.
  * [Change format](#format) of the declaration.

> **Note.** If you don't have any BEM projects available to try out the `@bem/sdk.decl` package, the quickest way to create one is to use [bem-express](https://github.com/bem/bem-express).

## Quickstart

> **Attention.** To use `@bem/sdk.decl`, you must install [Node.js 8.0+](https://nodejs.org/en/download/).

To run the `@bem/sdk.decl` package:

* [Install the `@bem/sdk.decl` package](#installing-the-bemsdkdecl-package)
* [Include the `@bem/sdk.decl` package](#including-the-bemsdkdecl-package)
* [Load declarations from files](#loading-declarations-from-files)
* [Subtract declarations](#subtracting-declarations)
* [Intersect declarations](#intersecting-declarations)
* [Merge declarations](#merging-declarations)
* [Save declaration to file](#saving-declaration-to-file)

### Installing the `@bem/sdk.decl` package

To install the `@bem/sdk.decl` package, run the following command:

```bash
npm install --save @bem/sdk.decl
```

### Including the `@bem/sdk.decl` package

Create a JavaScript file with any name (for example, **app.js**) and insert the following:

```js
const bemDecl = require('@bem/sdk.decl');
```

> **Note.** Use the same file for all of the following steps.

### Loading declarations from files

Create two files with declarations:

**set1.bemdecl.js:**

```js
exports.blocks = [
    {name: 'a'},
    {name: 'b'},
    {name: 'c'}
];
```

**set2.bemdecl.js:**

```js
exports.blocks = [
    {name: 'b'},
    {name: 'e'}
];
```

To get the declarations from the created files use the [`load()`](#load) method. Insert the following code into your file.

**app.js:**

```js
// Since we using sets stored in files we need to load them asynchronously
async function testDecl() {
    // Await loading of file and put it to `set1` variable
    const set1 = await bemDecl.load('set1.bemdecl.js');

    // `set1` is an array of BemCell objects,
    // convert them to strings using `.map` and special `id` property:
    console.log(set1.map(c => c.id).toString());
    // → ["a", "b", "c"]


    // Load the second set
    const set2 = await bemDecl.load('set2.bemdecl.js');
    console.log(set2.map(c => c.id).toString());
    // → ["b", "e"]
}

testDecl();
```

### Subtracting declarations

To subtract one set from another use the [`subtract()`](#subtract) method. Insert this code into your async function in your **app.js** file:

```js
console.log(bemDecl.subtract(set1, set2).map(c => c.id));
// → ["a", "c"]
```

Result will be different if we swap arguments:
```js
console.log(bemDecl.subtract(set2, set1).map(c => c.id).toString());
// → ["e"]
```

### Intersecting declarations

To calculate intersection between two sets use the [`intersect()`](#intersect) method:

```js
console.log(bemDecl.intersect(set1, set2).map(c => c.id));
// → ["b"]
```

### Merging declarations

To add elements from one set to other use the [`merge()`](#merge) method:

```js
console.log(bemDecl.merge(set1, set2).map(c => c.id));
// → a,b,c,e
```

### Saving declaration to file

To save the merged set use the [`save()`](#save) method. [Normalize](#normalize) the set before saving:

```js
const mergedSet = bemDecl.normalize(bemDecl.merge(set1, set2));
bemDecl.save('mergedSet.bemdecl.js', mergedSet, { format: 'v1', exportType: 'commonjs' })
```

The full code of **app.js** file:

```js
const bemDecl = require('@bem/sdk.decl');

// Since we using sets stored in files we need to load them asynchronously
async function testDecl() {
    // Await loading of file and put it to `set1` variable
    const set1 = await bemDecl.load('set1.bemdecl.js');

    // `set1` is an array of BemCell objects,
    // convert them to strings using `.map` and special `id` property:
    console.log(set1.map(c => c.id));
    // → ["a", "b", "c"]


    // Load the second set
    const set2 = await bemDecl.load('set2.bemdecl.js');
    console.log(set2.map(c => c.id));
    // → ["b", "e"]

    console.log(bemDecl.subtract(set1, set2).map(c => c.id));
    // → ["a", "c"]

    console.log(bemDecl.subtract(set2, set1).map(c => c.id));
    // → ["e"]

    console.log(bemDecl.intersect(set1, set2).map(c => c.id));
    // → ["b"]

    console.log(bemDecl.merge(set1, set2).map(c => c.id));
    // → a,b,c,e

    const mergedSet = bemDecl.normalize(bemDecl.merge(set1, set2));
    bemDecl.save('mergedSet.bemdecl.js', mergedSet, { format: 'v1', exportType: 'commonjs' })
}

testDecl();
```

[RunKit live example](https://runkit.com/migs911/parse-a-string-using-origin-naming-convention)

After you run the **app.js** file in the same directory the `mergedSet.bemdecl.js` file will be created with the following code:

```js
module.exports = {
    format: "v1",
    blocks: [
        {
            name: "a"
        },
        {
            name: "b"
        },
        {
            name: "c"
        },
        {
            name: "e"
        }
    ]
};
```

## BEMDECL formats

There are several formats:

* **'v1'** — the old [BEMDECL](https://en.bem.info/methodology/declarations/) format, also known as `exports.blocks = [ /* ... */ ]`.
* **'v2'** — the format based on [`deps.js`](https://en.bem.info/platform/deps/)-files, also known as `exports.deps = [ /* ... */ ]`.
* **'enb'** — the legacy format for widely used enb deps reader.

> **Note** `bem-decl` controls all of them.

## API

* [format()](#format)
* [load()](#load)
* [save()](#save)
* [merge()](#merge)
* [intersect()](#intersect)
* [subtract()](#subtract)
* [parse()](#parse)
* [stringify()](#stringify)
* [normalize()](#normalize)

### format()

Formats a normalized declaration to the target [format](#bemdecl-formats).

```js
/**
 * @param  {Array|Object} decl — Normalized declaration.
 * @param  {string} [opts.format] — Target format.
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
    new BemCell({ entity: new BemEntityName({ block: 'a' }) })
];
bemDecl.save('set.bemdecl.js', decl, { format: 'enb' })
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
    new BemCell({ entity: new BemEntityName({ block: 'a' }) })
];

const decl2 = [
    new BemCell({ entity: new BemEntityName({ block: 'b' }) })
];

const decl3 = [
    new BemCell({ entity: new BemEntityName({ block: 'a' }) }),
    new BemCell({ entity: new BemEntityName({ block: 'b' }) }),
    new BemCell({ entity: new BemEntityName({ block: 'c' }) })
];

bemDecl.merge(decl1, decl2, decl3).map(c => c.id);
// → ['a', 'b', 'c']
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
    new BemCell({ entity: new BemEntityName({ block: 'a' }) }),
    new BemCell({ entity: new BemEntityName({ block: 'b' }) })
];

const decl2 = [
    new BemCell({ entity: new BemEntityName({ block: 'a' }) }),
    new BemCell({ entity: new BemEntityName({ block: 'c' }) })
];

const decl3 = [
    new BemCell({ entity: new BemEntityName({ block: 'a' }) }),
    new BemCell({ entity: new BemEntityName({ block: 'e' }) })
];

bemDecl.intersect(decl1, decl2, decl3).map(c => c.id);
// → ['a']
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
    new BemCell({ entity: new BemEntityName({ block: 'a' }) }),
    new BemCell({ entity: new BemEntityName({ block: 'b' }) }),
    new BemCell({ entity: new BemEntityName({ block: 'c' }) })
];

const decl2 = [
    new BemCell({ entity: new BemEntityName({ block: 'b' }) })
];

const decl3 = [
    new BemCell({ entity: new BemEntityName({ block: 'c' }) })
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
bemDecl.parse('exports.deps = [{ block: "a" }]').map(c => c.id);

// → ['a']
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
    new BemCell({ entity: new BemEntityName({ block: 'a' }) })
];

bemDecl.stringify(decl, { format: 'enb', exportType: 'commonjs' });
 
// → module.exports = {
// →     "format": "enb",
// →     "decl": [
// →         {
// →             "block": "a"
// →         }
// →     ]
// → };
```

### normalize()

Normalizes the declaration declaration.

```js
/**
 * @param {Array<{block: string, elem: ?string, mod: ?{name: string, val: (string|true)}, tech: ?string}>} decl - declaration
 * @param {Object} [opts] - Additional options.
 * @param {String} [opts.format] - Format of the output (v1, v2, enb).
 * @param {String} [opts.scope] - Only for "v2" format.
 * @returns {BemCell[]}
 */
normalize(decl, opts)
```

## Contributing

Please read [CONTRIBUTING.md](https://github.com/bem/bem-sdk/blob/master/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/bem/bem-sdk/tree/master/packages/decl/tags).

## License

Code and documentation copyright © 2014-2019 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
