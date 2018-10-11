# walk

Tool for traversing a [BEM](https://en.bem.info) project's file system.

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.org/package/@bem/sdk.walk
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.walk.svg

* [Introduction](#introduction)
* [Try walk](#try-walk)
* [Quick start](#quick-start)
* [API reference](#api-reference)
* [Parameter tuning](#parameter-tuning)
* [Usage examples](#usage-examples)

## Introduction

Walk traverses the project's file system and returns the following information about found files:

* The type of BEM entity: [block](https://en.bem.info/methodology/key-concepts/#block), [element](https://en.bem.info/methodology/key-concepts/#element) or [modifier]( https://en.bem.info/methodology/key-concepts/#modifier).
* The [implementation technology]( https://en.bem.info/methodology/key-concepts/#implementation-technology): JS, CSS, etc.
* The location in the [file system](https://en.bem.info/methodology/filestructure/).

> **Note.** If you don't have any BEM projects available to try out the `@bem/sdk.walk` package, the quickest way to create one is to use [bem-express](https://github.com/bem/bem-express).

## Try walk

An example is available in the [RunKit editor](https://runkit.com/zxqfox/5b47d9f7399d64001271c5f4).

## Quick start

> **Attention.** To use `@bem/sdk.walk`, you must install [Node.js 8.0+](https://nodejs.org/en/download/).

To run the `@bem/sdk.walk` package:

1. [Install walk](#bemsdkwalk-package-installation).
2. [Include the package](#bemsdkwalk-package-including).
3. [Define the file system levels](#file-system-levels-definition).
4. [Define the paths to traverse](#paths-to-traverse-definition).
5. [Get information about found files](#get-information-about-found-files).

### Installing the `@bem/sdk.walk` package

To install the `@bem/sdk.walk` package, run the following command:

```
$ npm install --save @bem/sdk.walk
```

### Including the `@bem/sdk.walk` package

Create a JavaScript file with any name (for example, **app.js**) and insert the following:

```js
const walk = require('@bem/sdk.walk');
```

> **Note.** Use the same file for all of the following steps.

### Defining file system levels

Define the project's [file system levels](https://en.bem.info/methodology/redefinition-levels/) in the `config` object.

**Example:**

```js
const config = {
    // Project levels.
    levels: {
        'level1': {
            // File naming scheme.
            naming: {
                preset: 'value'
            }
        },
        'level2': {
            // File naming scheme.
            naming: {
                preset: 'value'
            }
        },
        ...
    }
};
```

Specify the [file naming scheme](https://github.com/bem/bem-sdk/tree/master/packages/naming.entity) for each redefinition level. This lets you get information about BEM entities using their names or using the names of files and directories.

The table shows acceptable values that can be set for the file naming scheme.

| Key | Supported values |
|-----|------------------|
| `naming` | `legacy`, `origin`, `two-dashes`, `react`, `origin-react` |

> **Note.** For more information about the file naming preset, see [@bem/sdk.naming.presets](https://github.com/bem/bem-sdk/tree/master/packages/naming.presets)

**app.js file:**

```js
const walk = require('@bem/sdk.walk');
// Config object with sample value.
const config = {
    levels: {
        'common.blocks': {
            naming: {
                preset: 'legacy'
            }
        }
    }
};
```

### Defining paths to traverse

Specify the paths to walk in the `levels` object.

> **Note.** You can use relative or absolute paths.

**Example:**

```js
const levels = [
    'common.blocks'
];
```

**app.js file:**

```js
const walk = require('@bem/sdk.walk');
// Config object with sample value.
const config = {
    levels: {
        'common.blocks': {
            naming: {
                preset: 'legacy'
            }
        }
    }
};
// Levels object with sample value.
const levels = [
    'common.blocks'
];
```

### Getting information about found files

Pass the `levels` and `config` objects to the [walk()](#walk-1) method.

**app.js file:**

```js
const walk = require('@bem/sdk.walk');
// Config object with sample value.
const config = {
    levels: {
        'common.blocks': {
            naming: {
                preset: 'legacy'
            }
        }
    }
};
// Levels object with sample value.
const levels = [
    'common.blocks'
];
(async () => {
    console.log(await walk.asArray(levels, config));
})();
```

The `walk.asArray()` function is used for getting data about found files. When a portion of data is received, the `data` event is generated and [information about the found file](#output-data) is added to the `files` array. If an error occurs, `walk` stops processing the request and returns a response containing the error ID and description. The `end` event occurs when all the data has been received from the stream.

After that, run your web server using the `node app.js` comand, and you will see a result that looks like this:

```js
[
    BemFile { 
        cell: {
            entity: { block: 'page', mod: [Object] },
            tech: 'bemtree.js',
            layer: 'common' 
        },
        path: 'common.blocks/page/_view/page_view_404.bemtree.js',
        level: 'common.blocks' 
    },
    BemFile { 
        cell: { 
            entity: { block: 'page', mod: [Object] },
            tech: 'post.css',
            layer: 'common' 
        },
        path: 'common.blocks/page/_view/page_view_404.post.css',
        level: 'common.blocks' 
    },
    ...
]
```

## API reference

### walk()

```js
/**
* Traverse a BEM project's file system.
*
* @param {string[]} levels — paths to traverse
* @param {object} config — project's file system levels
* @return {{cell: {entity: ?BemEntityName, layer: ?string, tech: ?string}, 
path: ?string, level: ?string}[]} — readable stream
*/
walk(levels, config);
```

Traverses the directories described in the `levels` parameter and returns `stream.Readable`.

#### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `levels` | `string[]` | Paths to traverse |
| `config` | `object` | Project levels |

#### Output data

A readable stream (`stream.Readable`) that has the following events:

| Event | Description |
|-------|-------------|
|`data`|Returns a JavaScript object with information about a found file. <br><br>The example below shows a JSON interface with elements that are in the response for the `walk` method. Objects and keys have sample values.<br><br> **Example:** <br><br><code>{</code><br><code>  "cell": {</code><br><code>    "entity": { "block": "page" },</code><br><code>    "tech": "bemtree.js",</code><br><code>    "layer": "common"</code><br><code>  },</code><br><code>  "path": "common.blocks/page/page.bemtree.js"</code><br><code>  "level": "common.blocks"</code><br><code>}</code><br><br>**Fields:** <br><br>`cell` — BEM cell instance.<br>`entity` — BEM entity name instance.<br>`tech` — Implementation technology.<br>`layer` — Semantic layer.<br>`path` — Relative path to the file.<br>`level` — File system level.|
| `error` | Generated if an error occurred while traversing the levels. Returns an object with the error description.|
| `end` | Generated when `walk` finishes traversing the levels defined in the `levels` object.|

## Parameter tuning

Walk provides a flexible interface for parameter tuning and can be configured to suit different tasks.

This section contains some tips on the possible parameter settings.

* [Extending config object definitions](#extending-config-object-definitions)
* [Automatically defining config objects](#automatically-defining-config-objects)

### Extending config object definitions

If your project's [file naming scheme](https://github.com/bem/bem-sdk/tree/master/packages/naming.presets) doesn't match the default file system type, you can define it manually.

**Example:**

```js
/**
* The project's file naming scheme is `legacy`, which matches the `nested` file system type by default.
* Step 1: https://github.com/bem/bem-sdk/blob/master/packages/naming.presets/legacy.js
* Step 2: https://github.com/bem/bem-sdk/blob/master/packages/naming.presets/origin.js
*/
const config = {
    levels: {
        'common.blocks': {
            naming: {
                preset: 'legacy',
                // Manually defining the project's file system type.
                fs: {
                    scheme: 'mixed'
                }
            }
        }
    }
};
```

> **Note.** For more information about file systems, see [@bem/sdk.naming.cell.match](https://github.com/bem/bem-sdk/tree/master/packages/naming.cell.match)

In order to define the default layer, you can use the `defaultLayer` field.

**Example:**

```js
const config = {
    levels: {
        'common.blocks': {
            naming: {
                preset: 'legacy',
                fs: {
                    defaultLayer: 'common'
                }
            }
        }
    }
};
```

### Automatically defining config objects

Instead of defining the project's levels manually, you can use the [@bem/sdk.config](https://github.com/bem/bem-sdk/tree/master/packages/config) package.

Use the `levelMapSync()` method which returns the project's file system levels.

**Example:**

```js
const walk = require('@bem/sdk.walk');
const bemconfig = require('@bem/sdk.config')();
const levelMap = bemconfig.levelMapSync();
const levels = [
    '.'
];
const config = {
    levels: levelMap
};
(async () => {
    console.log(await walk.asArray(levels, config));
})();
```

## Usage examples

Typical tasks that use the resulting JavaScript objects:

* [Grouping](#grouping)
* [Filtering]( #filtering)
* [Data transformation](#data-transformation)

### Grouping

Grouping found files by block name.

```js
const walk = require('@bem/sdk.walk');
const bemconfig = require('@bem/sdk.config')();
const util = require('util');
const levelMap = bemconfig.levelMapSync();
const levels = [
    '.'
];
const config = {
    levels: levelMap
};
const groups = {};
(async () => {
    const files = await walk.asArray(levels, config);
    files.filter(file => {
           // Getting the block name for a found file.
           const block = file.entity.block;

           // Adding information about the found file.
           (groups[block] = []).push(file);
    });
    console.log(util.inspect(groups, {
        depth: null
    }));
})();

/*
{ page: 
    [ BemFile { cell: 
        { entity: { block: 'page', mod: { name: 'view', val: '404' } },
        tech: 'post.css',
        layer: 'common' },
        path: 'common.blocks/page/_view/page_view_404.post.css',
        level: '.' } ],
    ...
}
*/
```

[RunKit live editor](https://runkit.com/godfreyd/5b76ad644734800012ef6364).

### Filtering

Finding files for the `page` block.

```js
const walk = require('@bem/sdk.walk');
const bemconfig = require('@bem/sdk.config')();
const levelMap = bemconfig.levelMapSync();
const levels = [
    '.'
];
const config = {
    levels: levelMap
};
const entities = [];
(async () => {
    const files = await walk.asArray(levels, config);
    files.filter(file => {
           // Getting the block name for a found file.
           const block = file.entity.block;

            // Adding information about the found file.
            if (block == 'page') {
                entities.push(file);
            }
    });
    console.log(entities);
})();

/*
[   BemFile { cell: 
        { entity: { block: 'page' },
        tech: 'bemtree.js',
        layer: 'common' },
        path: 'common.blocks/page/page.bemtree.js',
        level: '.' },
    BemFile { cell: { entity: { block: 'page' }, 
        tech: 'deps.js', layer: 'common' },
        path: 'common.blocks/page/page.deps.js',
        level: '.' },
    BemFile { cell: 
        { entity: { block: 'page' },
        tech: 'deps.js',
         layer: 'development' },
        path: 'development.blocks/page/page.deps.js',
        level: '.' },
    ...
]
*/
```

[RunKit live editor](https://runkit.com/godfreyd/5b76b188fa6c3b0013f1ebca).

### Data transformation

Finding BEM files, reading the contents, and creating the new `source` property.

```js
const { promisify } = require('util');
const fs = require('fs');
const walk = require('@bem/sdk.walk');
const bemconfig = require('@bem/sdk.config')();
const readFileAsync = promisify(fs.readFile);
const levelMap = bemconfig.levelMapSync();
const levels = [
    '.'
];
const config = {
    levels: levelMap
};
(async() => {
    const files = await walk.asArray(levels, config);
    const res = {};
    for (const file of files) {
        res.file = file;
        res.source = await readFileAsync(file.path, 'utf-8');
    }
    console.log(res);
})();

/*
{ file: BemFile { cell: 
    { entity: { block: 'page' }, tech: 'deps.js', layer: 'development' },
    path: 'development.blocks/page/page.deps.js',
    level: '.' },
    source: '({\n    shouldDeps: \'livereload\'\n});\n' },
...
]
*/
```

[RunKit live editor](https://runkit.com/godfreyd/5b76f0bea0539d0012fcb421).
