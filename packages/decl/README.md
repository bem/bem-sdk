# decl

A tool for working with [declarations](https://en.bem.info/methodology/declarations/) in BEM.

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.org/package/@bem/sdk.decl
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.decl.svg

* [Introduction](#introduction)
* [Installation](#installation)
* [Quick start](#quick-start)
* [BEMDECL formats](#bemdecl-formats)
* [API reference](#api-reference)
* [License](#license)

## Introduction

A declaration is a list of [BEM entities](https://en.bem.info/methodology/key-concepts/#bem-entity) (blocks, elements and modifiers) and their [technologies](https://en.bem.info/methodology/key-concepts/#implementation-technology) that are used on a page.

A build tool uses declaration data to narrow down a list of entities that end up in the final project.

This tool contains a number of methods to work with declarations:

* [Load](#load) a declaration from a file and convert it to a set of [BEM cells][cell-package].
* Modify sets of BEM cells:
  * [Subtract](#subtract) sets.
  * [Intersect](#intersect) sets.
  * [Merge](#merge) sets (adding declarations).
* [Save](#save) a set of BEM cells in a file.

This tool also contains the [`assign()`](#assign) method. You can use this method to populate empty BEM cell fields with the fields from the scope.

> **Note.** If you don't have any BEM projects available to try out the `@bem/sdk.decl` package, the quickest way to create one is to use [bem-express](https://github.com/bem/bem-express).

## Installation

To install the `@bem/sdk.decl` package, run the following command:

```bash
npm install --save @bem/sdk.decl
```

## Quick start

> **Attention.** To use `@bem/sdk.decl`, you must install [Node.js 8.0+](https://nodejs.org/en/download/).

Use the following steps after [installing the package](#installation).

To run the `@bem/sdk.decl` package:

1. [Load declarations from files](#loading-declarations-from-files)
1. [Subtract declarations](#subtracting-declarations)
1. [Intersect declarations](#intersecting-declarations)
1. [Merge declarations](#merging-declarations)
1. [Save declarations to a file](#saving-declarations-to-a-file)

### Loading declarations from files

Create two files with declarations and insert the following code into them:

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

In the same directory, create a JavaScript file with any name (for example, **app.js**), so your work directory will look like:

```
app/
├── app.js — your application file.
├── set1.bemdecl.js — the first declaration file.
└── set2.bemdecl.js — the second declaration file.
```

To get the declarations from the created files, use the [`load()`](#load) method. Insert the following code into your **app.js** file:

```js
const bemDecl = require('@bem/sdk.decl');

// Since we are using sets stored in files, we need to load them asynchronously.
async function testDecl() {
    // Wait for the file to load and set the `set1` variable.
    const set1 = await bemDecl.load('set1.bemdecl.js');

    // `set1` is an array of BemCell objects.
    // Convert them to strings using the `map()` method and special `id` property:
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

To subtract one set from another, use the [`subtract()`](#subtract) method. Insert this code into your async function in your **app.js** file:

```js
console.log(bemDecl.subtract(set1, set2).map(c => c.id));
// => ['a', 'c']
```

The result will be different if we swap arguments:

```js
console.log(bemDecl.subtract(set2, set1).map(c => c.id));
// => ['e']
```

### Intersecting declarations

To calculate the intersection between two sets, use the [`intersect()`](#intersect) method:

```js
console.log(bemDecl.intersect(set1, set2).map(c => c.id));
// => ['b']
```

### Merging declarations

To add elements from one set to another set, use the [`merge()`](#merge) method:

```js
console.log(bemDecl.merge(set1, set2).map(c => c.id));
// => ['a', 'b', 'c', 'e']
```

### Saving declarations to a file

To save the merged set, use the [`save()`](#save) method. [Normalize](#normalize) the set before saving:

```js
const mergedSet = bemDecl.normalize(bemDecl.merge(set1, set2));
bemDecl.save('mergedSet.bemdecl.js', mergedSet, { format: 'v1', exportType: 'commonjs' })
```

The full code of the **app.js** file will look like this:

```js
const bemDecl = require('@bem/sdk.decl');

// Since we are using sets stored in files, we need to load them asynchronously.
async function testDecl() {
    // Wait for the file to load and set the `set1` variable.
    const set1 = await bemDecl.load('set1.bemdecl.js');

    // `set1` is an array of BemCell objects.
    // Convert them to strings using the `map()` method and special `id` property:
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

Run the **app.js** file. The `mergedSet.bemdecl.js` file will be created in the same directory with the following code:

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

* **'v1'** — The old [BEMDECL](https://en.bem.info/methodology/declarations/) format, also known as `exports.blocks = [ /* ... */ ]`.
* **'v2'** — The format based on [`deps.js`](https://en.bem.info/technologies/classic/deps-spec/) files, also known as `exports.decl = [ /* ... */ ]`. You can also specify the declaration in the `deps` field: `exports.deps = [ /* ... */ ]` like in the 'enb' format.
* **'enb'** — The legacy format for the widely used enb deps reader, also known as `exports.deps = [ /* ... */ ]`. This format looks like the 'v2' format, but doesn't support [syntactic sugar](https://en.bem.info/technologies/classic/deps-spec/#syntactic-sugar) from this format.

> **Note**. `bem-decl` controls all of them.

## API reference

* [load()](#load)
* [parse()](#parse)
* [normalize()](#normalize)
* [subtract()](#subtract)
* [intersect()](#intersect)
* [merge()](#merge)
* [save()](#save)
* [stringify()](#stringify)
* [format()](#format)
* [assign()](#assign)

### load()

Loads a declaration from the specified file.

This method reads the file and calls the [parse()](#parse) function on its content.

```js
/**
 * @param  {string} filePath — Path to file.
 * @param  {Object|string} opts — Additional options.
 * @return {Promise} — A promise that represents `BemCell[]`.
 */
format(filePath, opts)
```

You can pass additional options that are used in the [`readFile()`](https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback) method from the Node.js File System.

The declaration in the file can be described in any [format](#bemdecl-formats).

### parse()

Parses the declaration from a string or JS object to a set of [BEM cells][cell-package].

This method automatically detects the format of the declaration and calls a `parse()` function for the detected format. Then it [normalizes](#normalize) the declaration and converts it to a set of BEM cells.

```js
/**
 * @param {string|Object} bemdecl — String of bemdecl or object.
 * @returns {BemCell[]} — Set of BEM cells.
 */
parse(bemdecl)
```

[RunKit live example](https://runkit.com/migs911/bem-decl-parse-declaration).

### normalize()

Normalizes the array of entities from a declaration for the specified format. If successful, this method returns the list of [BEM cells][cell-package] which represents the declaration.

This method is an alternative to the [`parse()`](#parse) method. In this method, you pass a format and the declaration contents separately.

```js
/**
 * @param {Array|Object} decl — Declaration.
 * @param {Object} [opts] — Additional options.
 * @param {string} [opts.format='v2'] — Format of the declaration (v1, v2, enb).
 * @param {BemCell} [opts.scope] — A BEM cell to use as the scope to populate the fields of normalized entites. Only for 'v2' format.
 * @returns {BemCell[]}
 */
normalize(decl, opts)
```

[RunKit live example](https://runkit.com/migs911/bem-decl-normalize-declaration).

### subtract()

Calculates the set of [BEM cells][cell-package] that occur only in the first passed set and do not exist in the rest. [Read more](https://en.bem.info/methodology/declarations/#subtracting-declarations).

```js
/**
 * @param {BemCell[]} set — Original set of BEM cells.
 * @param {...(BemCell[])} removingSet — Set (or sets) with cells that should be removed.
 * @returns {BemCell[]} — Resulting set of cells.
 */
subtract(set, removingSet, ...)
```

[RunKit live example](https://runkit.com/migs911/bem-decl-subtracting-declarations).

### intersect()

Calculates the set of [BEM cells][cell-package] that exists in each passed set. [Read more](https://en.bem.info/methodology/declarations/#intersecting-declarations).

```js
/**
 * @param {BemCell[]} set — Original set of BEM cells.
 * @param {...(BemCell[])} otherSet — Set (or sets) that should be merged into the original one.
 * @returns {BemCell[]} — Resulting set of cells.
 */
intersect(set, otherSet, ...)
```

[RunKit live example](https://runkit.com/migs911/bem-decl-intersecting-declarations).

### merge()

Merges multiple sets of [BEM cells][cell-package] into one set. [Read more](https://en.bem.info/methodology/declarations/#adding-declarations)

```js
/**
 * @param {BemCell[]} set — Original set of cells.
 * @param {...(BemCell[])} otherSet — Set (or sets) that should be merged into the original one.
 * @returns {BemCell[]} — Resulting set of cells.
 */
merge(set, otherSet, ...)
```

[RunKit live example](https://runkit.com/migs911/bem-decl-merging-declarations).

### save()

Formats and saves a file with [BEM cells][cell-package] from a file in any format.

```js
/**
 * @param   {string} filename — File path to save the declaration.
 * @param   {BemCell[]} cells  — Set of BEM cells to save.
 * @param   {Object} [opts] — Additional options.
 * @param   {string} [opts.format='v2'] — The desired format (v1, v2, enb).
 * @param   {string} [opts.exportType='cjs'] — The desired type for export.
 * @returns {Promise.<undefined>} — A promise resolved when the file is stored.
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
 * @param {BemCell|BemCell[]} decl — Source declaration.
 * @param {Object} opts — Additional options.
 * @param {string} opts.format — Format of the output declaration (v1, v2, enb).
 * @param {string} [opts.exportType=json5] — Defines how to wrap the result (commonjs, json5, json, es6|es2015).
 * @param {string|Number} [opts.space] — Number of space characters or string to use as white space (exactly as in JSON.stringify).
 * @returns {string} — String representation of the declaration.
 */
stringify(decl, options)
```

[RunKit live example](https://runkit.com/migs911/bem-decl-stringify-a-set-of-bem-cells).

### format()

Formats a normalized declaration to the target [format](#bemdecl-formats).

```js
/**
 * @param  {Array|Object} decl — Normalized declaration.
 * @param  {string} opts.format — Target format (v1, v2, enb).
 * @return {Array} — Array with converted declaration.
 */
format(decl, opts)
```

### assign()

Populates empty BEM cell fields with the fields from the scope, except the `layer` field.

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
 * @param {Object} cell - BEM cell fields, except the `layer` field.
 * @param {BemEntityNameFields} [cell.entity] — Object with fields that specify the BEM entity name.
 *                               This object has the same structure as `BemEntityName`,
 *                               but all properties inside are optional.
 * @param {string} [cell.tech] — BEM cell technology.
 * @param {BemCell} scope — Context (usually the processing entity).
 * @returns {BemCell} — Filled BEM cell with `entity` and `tech` fields.
 */
assign(cell, scope)
```

[RunKit live example](https://runkit.com/migs911/bem-decl-using-assign-function).

See another example of `assign()` usage in the [Select all checkboxes](#select-all-checkboxes) section.

## Usage examples

### Select all checkboxes

Let's say you have a list of checkboxes and you want to implement the "Select all" button, which will mark all checkboxes as `checked`.

Each checkbox is an element of the `checkbox` block, and `checked` is the value of the `state` modifier.

```js
const bemDecl = require('@bem/sdk.decl');
const bemCell = require('@bem/sdk.cell');

// Sets the 'state' modifier for the entity.
function select(entity) {
    const selectedState = {
        entity: { mod: { name: 'state', val: 'checked'}}
    };
    return bemDecl.assign(selectedState, entity);
};

// Sets the 'state' modifier for the array of entities.
function selectAll(entities) {
    return entities.map(e => select(e));
};

// Let's define BEM cells that represent checkbox entities.
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
