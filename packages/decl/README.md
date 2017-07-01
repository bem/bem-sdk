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

### load method

Loads BEM-entities from a file in any format.

#### Syntax

`load(file[, options])`

#### Input parameters

| Parameter | Type | Description |
|----------|-----|----------|
|**file**|`string`|`bemdecl.js`-filename or path to the file. </br>Examples: </br> &#149; `example.bemdecl.js`; </br> &#149; `./desktop.bundles/example/example.bemdecl.js`.|
|**options**|`*`| &#149; encoding `String`, `Null` (default = `null`); </br> &#149; flag `String` (default = `'r'`). </br> [Read more](https://nodejs.org/api/fs.html#fs_fs_readfile_file_options_callback).|

#### Output data

A promise that represents `BemCell[]`. [Read more about BemCell](https://github.com/bem/bem-sdk/tree/master/packages/cell).

#### Example

```js
bemDecl.load('set1.bemdecl.js')
    .then(decl => {
        // Work with declaration
    });
```

### save method

Formats and saves a file with BEM-entities from a file in any format

#### Syntax

`save(file, decl, opts)`

#### Input data

| Parameter | Type | Description |
|-----------|------|-------------|
|**file**|`string`|`bemdecl.js`-filename or path to the file. </br>Examples: </br> &#149; `example.bemdecl.js`; </br> &#149; `./desktop.bundles/example/example.bemdecl.js`.|
|**decl**|`BemCell[]`|Set of BEM-entities to save in specific format.|
|**options**|`Object`|Options for stringify and saveFile methods.</br> &#149; format `String`; &#149; exportType `String` (default = `'cjs'`); </br> &#149; encoding `String` (default = `'utf8'`); </br> &#149; flag `String` (default = `'r'`). </br> [Read more](https://nodejs.org/api/fs.html#fs_fs_savefile_file_options_callback).|

#### Output data

A promise resolved when file was stored.

#### Example

```js
const decl = [
    new BemCell({ entity: new BemEntityName({ block: 'button' }) })
];
bemDecl.save('set1.bemdecl.js', decl, { format: 'enb' })
    .then(() => {
        console.log('saved');
    });
```

### merge method

Merges many sets of BEM-entities into one.

#### Syntax

`merge(set1, set2, ...)`

#### Input parameters

| Parameter | Type | Description |
|----------|-----|----------|
|**set1, set2, ...**|`BemCell[]`|Sets of BEM-entities. [Read more](https://en.bem.info/methodology/declarations/#adding-declarations).|

#### Output data

A new set of BEM-entities (`BemCell[]`).

#### Example

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

### intersect method

Calculates the set of BEM-entities that exists in each passed set.

#### Syntax

`intersect(set1, set2, ...)`

#### Input parameters

| Parameter | Type | Description |
|----------|-----|----------|
|**set1, set2, ...**|`BemCell[]`|Sets of BEM-entities. [Read more](https://en.bem.info/methodology/declarations/#intersecting-declarations).|

#### Output data

A new set of BEM-entities (`BemCell[]`).

#### Example

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

### subtract method

Calculates the set of BEM-entities that occur only in the first passed set and does not exist in the rest.

#### Syntax

`subtract(set1, set2, ...)`

#### Input parameters

| Parameter | Type | Description |
|----------|-----|----------|
|**set1, set2, ...**|`BemCell[]`|Sets of BEM-entities. **set1** is the main set. [Read more](https://en.bem.info/methodology/declarations/#subtracting-declarations).|

#### Output data

A new set of BEM-entities (`BemCell[]`).

#### Example

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

### parse method

Parses raw string or evaluated JS object to a set of BEM-entities.

#### Syntax

`parse(bemdecl)`

#### Input parameters

| Parameter | Type | Description |
|----------|-----|----------|
|**bemdecl**| `string` &#124; `Object` |Declaration of BEM-entities.|

#### Output data

Set of BEM-entities (`BemCell[]`).

#### Example

```js
bemDecl.parse('exports.deps = [{ block: "button" }]').map(c => c.id);

// → ['button']
```

See also [Declarations in BEM](https://en.bem.info/methodology/declarations/).

### stringify method

Stringifies set of BEM-entities to a specific format.

**Note** Temporary there is just `enb` format. It will be fixed later.

#### Syntax

`stringify(set, options)`

#### Input parameters

| Parameter | Type | Description |
|----------|-----|----------|
|**set**|`BemCell[]`|Representation of BEM-entity.|
|**options**|`Object`|Example: `{format: 'enb'}`|
|**options.format**|`String`|Format of the output. Example: `'enb'`|
|**options.exportType**|`String`|Type of output wrapper. Example: `'json5'`|
|**options.space**|`String|Number`|Number of space characters or string to use as a white space(exactly as in JSON.stringify). Example: `4`|

#### Output data

`String`.

#### Example

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
