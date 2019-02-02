# decl

The tool to work with [declarations](https://en.bem.info/methodology/declarations/) in BEM.

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.org/package/@bem/sdk.decl
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.decl.svg

* [Introduction](#introduction)
* [Quick start](#quick-start)
* [BEMDECL formats](#bemdecl-formats)
* [API](#api)
* [Versioning](#versioning)
* [License](#license)

## Introduction

A declaration is a list of [BEM entities](https://en.bem.info/methodology/key-concepts/#bem-entity) (blocks, elements and modifiers) that are used on a page. Also you can specify a [technology](https://en.bem.info/methodology/key-concepts/#implementation-technology) for each BEM entity so all methods in this package use [BemCell][cell-package] object to represent a BEM entity. In fact each declaration is a list of BEM cells.

A build tool uses declaration data to narrow down a list of entities that end up in the final project.

This tool contains number of methods to work with the declarations:

* Read declarations:
  * [Load](#load) a declaration from a file.
  * [Parse](#parse) a string with declaration.
* Modify declarations:
  * [Normalize](#normalize) a declaration.
  * [Subtract](#subtract) declarations.
  * [Intersect](#intersect) declarations.
  * [Merge](#merge) declarations (adding declarations).
* Save declarations:
  * [Save](#save) a declaration to a file.
  * [Stringify](#stringify) a declaration.
  * [Change format](#format) of a declaration.

Also, this tool contains the [`assign()`](#assign) method. This method allows you to fill missed BEM cell fields with the fields from the scope.

> **Note.** If you don't have any BEM projects available to try out the `@bem/sdk.decl` package, the quickest way to create one is to use [bem-express](https://github.com/bem/bem-express).

## Installing

## Quick start

> **Attention.** To use `@bem/sdk.decl`, you must install [Node.js 8.0+](https://nodejs.org/en/download/).

To run the `@bem/sdk.decl` package:

1. [Install the `@bem/sdk.decl` package](#installing-the-bemsdkdecl-package)
2. [Include the `@bem/sdk.decl` package](#including-the-bemsdkdecl-package)
3. [Load declarations from files](#loading-declarations-from-files)
4. [Subtract declarations](#subtracting-declarations)
5. [Intersect declarations](#intersecting-declarations)
6. [Merge declarations](#merging-declarations)
7. [Save declaration to file](#saving-declaration-to-file)

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

```
app/
├── app.js — your application file.
├── set1.bemdecl.js — the first declaration file.
└── set2.bemdecl.js — the second declaration file.
```

Insert the following code into the created files:

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
// Since we using sets stored in files we need to load them asynchronously.
async function testDecl() {
    // Await loading of file and put it to `set1` variable.
    const set1 = await bemDecl.load('set1.bemdecl.js');

    // `set1` is an array of BemCell objects,
    // convert them to strings using the `map()` method and special `id` property:
    console.log(set1.map(c => c.id));
    // => ['a', 'b', 'c']


    // Load the second set.
    const set2 = await bemDecl.load('set2.bemdecl.js');
    console.log(set2.map(c => c.id));
    // => ['b', 'e']
}

testDecl();
```

### Subtracting declarations

To subtract one set from another use the [`subtract()`](#subtract) method. Insert this code into your async function in your **app.js** file:

```js
console.log(bemDecl.subtract(set1, set2).map(c => c.id));
// => ['a', 'c']
```

Result will be different if we swap arguments:
```js
console.log(bemDecl.subtract(set2, set1).map(c => c.id));
// => ['e']
```

### Intersecting declarations

To calculate intersection between two sets use the [`intersect()`](#intersect) method:

```js
console.log(bemDecl.intersect(set1, set2).map(c => c.id));
// => ['b']
```

### Merging declarations

To add elements from one set to other use the [`merge()`](#merge) method:

```js
console.log(bemDecl.merge(set1, set2).map(c => c.id));
// => ['a', 'b', 'c', 'e']
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

// Since we using sets stored in files we need to load them asynchronously.
async function testDecl() {
    // Await loading of file and put it to `set1` variable.
    const set1 = await bemDecl.load('set1.bemdecl.js');

    // `set1` is an array of BemCell objects,
    // convert them to strings using the `map()` method and special `id` property:
    console.log(set1.map(c => c.id));
    // => ['a', 'b', 'c']


    // Load the second set.
    const set2 = await bemDecl.load('set2.bemdecl.js');
    console.log(set2.map(c => c.id));
    // => ['b', 'e']

    console.log(bemDecl.subtract(set1, set2).map(c => c.id));
    // => ['a', 'c']

    console.log(bemDecl.subtract(set2, set1).map(c => c.id));
    // => ['e']

    console.log(bemDecl.intersect(set1, set2).map(c => c.id));
    // => ['b']

    console.log(bemDecl.merge(set1, set2).map(c => c.id));
    // => ['a', 'b', 'c', 'e']

    const mergedSet = bemDecl.normalize(bemDecl.merge(set1, set2));
    bemDecl.save('mergedSet.bemdecl.js', mergedSet, { format: 'v1', exportType: 'commonjs' })
}

testDecl();
```

[RunKit live example](https://runkit.com/migs911/how-bem-sdk-decl-works).

After you run the **app.js** file in the same directory the `mergedSet.bemdecl.js` file will be created with the following code:

```js
module.exports = {
    format: 'v1',
    blocks: [
        {
            name: 'a'
        },
        {
            name: 'b'
        },
        {
            name: 'c'
        },
        {
            name: 'e'
        }
    ]
};
```

## BEMDECL formats

There are several formats:

* **'v1'** — the old [BEMDECL](https://en.bem.info/methodology/declarations/) format also known as `exports.blocks = [ /* ... */ ]`. This format supports only block names in the declaration.
* **'v2'** — the format based on [`deps.js`](https://en.bem.info/technologies/classic/deps-spec/)-files, also known as `exports.decl = [ /* ... */ ]`.
* **'enb'** — the legacy format for widely used enb deps reader, also known as `exports.deps = [ /* ... */ ]`. This format looks like 'v2' format, but doesnt't support [syntactic sugar](https://en.bem.info/technologies/classic/deps-spec/#syntactic-sugar) from this format.

> **Note**. `bem-decl` controls all of them.

## API

* [load()](#load)
* [parse()](#parse)
* [normalize()](#normalize)
* [subtract()](#subtract)
* [intersect()](#intersect)
* [merge()](#merge)
* [save()](#save)
* [stringify()](#stringify)
* [format()](#format)

### load()

Loads a declaration from specified file. This method reads the file and calls the [parse()](#parse) function on its content.

```js
/**
 * @param  {string} filePath — Path to file.
 * @param  {Object|string} opts — Additional options.
 * @return {Promise} — A promise that represents `BemCell[]`.
 */
format(filePath)
```

You can pass additional options that are used in the [readFile()]((https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback)) method from the Node.js File System.

The declaration in file can be described in any [format](#bemdecl-formats)

### parse()

Parses raw string or evaluated JS object to a set of [BEM cells][cell-package].

```js
/**
 * @param {String|Object} bemdecl - String of bemdecl or object.
 * @returns {BemCell[]} — Set of BEM cells.
 */
parse(bemdecl)
```

**Example:**

```js
bemDecl.parse('exports.deps = [{ block: 'a' }]').map(c => c.id);

// => ['a']
```

### normalize()

Normalizes the declaration and returns the list of [BEM cells][cell-package] which represents declaration.

```js
/**
 * @param {Array|Object} decl - declaration.
 * @param {Object} [opts] - Additional options.
 * @param {String} [opts.format] - Format of the output (v1, v2, enb).
 * @param {BemCell} [opts.scope] - A BEM cell to use as a scope to fill the fields of normalized entites. Only for 'v2' format.
 * @returns {BemCell[]}
 */
normalize(decl, opts)
```

### subtract()

Calculates the set of [BEM cells][cell-package] that occur only in the first passed set and does not exist in the rest. [Read more](https://en.bem.info/methodology/declarations/#subtracting-declarations).

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
// => ['a']
```

### intersect()

Calculates the set of [BEM cells][cell-package] that exists in each passed set. [Read more](https://en.bem.info/methodology/declarations/#intersecting-declarations).

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
// => ['a']
```

### merge()

Merges many sets of [BEM cells][cell-package] into one set. [Read more](https://en.bem.info/methodology/declarations/#adding-declarations)

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
// => ['a', 'b', 'c']
```

### save()

Formats and saves a file with [BEM cells][cell-package] from a file in any format.

```js
/**
 * @param   {String} filename — File path to save the declaration.
 * @param   {BemCell[]} cells  — Set of BEM cells to save.
 * @param   {Object} [opts] — Additional options.
 * @param   {String} [opts.format='v2'] — The desired format.
 * @param   {String} [opts.exportType='cjs'] — The desired type for export.
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

### stringify()

Stringifies a set of [BEM cells][cell-package] to a specific format.

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
    new BemCell({ entity: new BemEntityName({ block: 'a' }) }),
    new BemCell({ entity: new BemEntityName({ block: 'b' }) })
];

bemDecl.stringify(decl, { format: 'enb', exportType: 'commonjs' });
 
// => module.exports = {
//      'format': 'enb',
//      'decl': [
//          {
//              'block': 'a'
//          },
//          {
//              'block': 'b'
//          }
//      ]
//  };
```

### format()

Formats a normalized declaration to the target [format](#bemdecl-formats).

```js
/**
 * @param  {Array|Object} decl — Normalized declaration.
 * @param  {string} opts.format — Target format.
 * @return {Array} — Array with converted declaration.
 */
format(decl, opts)
```

### assign()

Fills missed BEM cell fields with the fields from the scope except the `layer` field.

```js
/**
 * @typedef BemEntityNameFields
 * @property {string} [block] — Block name.
 * @property {string} [elem] — Element name.
 * @property {string|Object} [mod] — Modifier name or object with name and value.
 * @property {string} [mod.name] — Modifier name.
 * @property {string} [mod.val=true] — Modifier value.
 */

/**
 * @param {Object} cell - BEM cell fields except the `layer` field.
 * @param {BemEntityNameFields} [cell.entity] — Object with fields that specify BEM entity name.
 *                               This object has the same structure as `BemEntityName`,
 *                               but all properties inside are optional.
 * @param {string} [cell.tech] — BEM cell technology.
 * @param {BemCell} scope - Context, the processing entity usually.
 * @returns {BemCell} - Filled BEM cell with `entity` and `tech fields.
 */
assign(cell, scope)
```

**Example:**

```js
const bemDecl = require('@bem/sdk.decl');

bemDecl.assign(
    { entity: { elem: '1'}, tech: 'js'},
    { entity: { block: 'a'}}
).valueOf();
// => { entity: { block: 'a', elem: '1'}, tech: 'js'}


bemDecl.assign(
    { tech: 'js'},
    { entity: { block: 'a'}, tech: 'css'}
).valueOf();
// => { entity: { block: 'a'}, tech: 'js'}

bemDecl.assign(
    { entity: { mod: { name: 'test'}}},
    { entity: { block: 'a', elem: '1'}, tech: 'js' }
).valueOf();
// => { entity: { block: 'a', elem: '1', mod: { name: 'test', val: true}}, tech: 'js'}

// If you pass only a `block` field, it will dominate over the other BemEntityName fields.
bemDecl.assign(
    { entity: { block: 'a'},
    { entity: { block: 'b', elem: '1'}, tech: 'js' }
).valueOf();
// => { entity: { block: 'a'}, tech: 'js'}
```

See another example of `assign()` usage in the [Select all checkboxes](#select-all-checkboxes) section.

## Usage examples

### Select all checkboxes

Let's say you have a list of checkboxes and you want to implement the "Select all" button, which will mark all checkboxes as `checked`.

Each checkbox is the element of the block `checkbox` and `checked` state is the value of the `state` modifier.

```js
const bemDecl = require('@bem/sdk.decl');
const bemCell = require('@bem/sdk.cell');

// Set state modifier for the entity.
function select(entity) {
    const selectedState = {
        entity: { mod: { name: 'state', val: 'checked'}}
    };
    return bemDecl.assign(selectedState, entity);
};

// Set state modifier for the array of entities.
function selectAll(entities) {
    return entities.map(e => select(e));
};

// Define BEM cells that represents checkbox entities.
const checkboxes = [
    bemCell.create({ block: 'checkbox', elem: '1', mod: { name: 'state', val: 'unchecked'}}),
    bemCell.create({ block: 'checkbox', elem: '2', mod: { name: 'state', val: 'checked'}}),
    bemCell.create({ block: 'checkbox', elem: '3', mod: { name: 'state'}}),
    bemCell.create({ block: 'checkbox', elem: '4'}),
];

// Select all checkboxes.
selectAll(checkboxes).map(e => e.valueOf());
// => [
//      { entity: { block: 'checkbox', elem: '1', mod: { name: 'state', val: 'checked'}}}
//      { entity: { block: 'checkbox', elem: '2', mod: { name: 'state', val: 'checked'}}}
//      { entity: { block: 'checkbox', elem: '3', mod: { name: 'state', val: 'checked'}}}
//      { entity: { block: 'checkbox', elem: '4', mod: { name: 'state', val: 'checked'}}}
//  ]
```

[RunKit live example](https://runkit.com/migs911/bem-sdk-decl-usage-examples-select-all-checkboxes).

## License

© 2019 [Yandex](https://yandex.com/company/). Code released under [Mozilla Public License 2.0](LICENSE.txt).



<!-- References list -->
[entity-name-package]: https://github.com/bem/bem-sdk/tree/master/packages/entity-name
[cell-package]: https://github.com/bem/bem-sdk/tree/master/packages/cell