# bem-walk

Tool for traversing a BEM project's file system.

[![NPM Status][npm-img]][npm]
[![Travis Status][test-img]][travis]
[![Windows Status][appveyor-img]][appveyor]
[![Coverage Status][coverage-img]][coveralls]
[![Dependency Status][david-img]][david]

[npm]:          https://www.npmjs.org/package/bem-walk
[npm-img]:      https://img.shields.io/npm/v/bem-walk.svg

[travis]:       https://travis-ci.org/bem-sdk/bem-walk
[test-img]:     https://img.shields.io/travis/bem-sdk/bem-walk.svg?label=tests

[appveyor]:     https://ci.appveyor.com/project/blond/bem-walk
[appveyor-img]: http://img.shields.io/appveyor/ci/blond/bem-walk.svg?style=flat&label=windows

[coveralls]:    https://coveralls.io/r/bem-sdk/bem-walk
[coverage-img]: https://img.shields.io/coveralls/bem-sdk/bem-walk.svg

[david]:        https://david-dm.org/bem-sdk/bem-walk
[david-img]:    http://img.shields.io/david/bem-sdk/bem-walk.svg?style=flat

It returns the following information about found files:

* The type of BEM entity ([block](https://en.bem.info/methodology/key-concepts/#block), [element](https://en.bem.info/methodology/key-concepts/#element) or [modifier]( https://en.bem.info/methodology/key-concepts/#modifier)).
* The [implementation technology]( https://en.bem.info/methodology/key-concepts/#implementation-technology).
* The location in the file system.

## Quick start

**Note** To use `bem-walk`, you must install Node.js 4.0+.

### 1. Install bem-walk

```
$ npm install --save bem-walk
```

### 2. Enable bem-walk

Create a JavaScript file with any name and add the following string:

```js
const walk = require('bem-walk');
```

**Note** You will use this JavaScript file for all the following steps.

### 3. Define file system levels

Define the project's file system levels in the `config` object.

```js
const config = {
    // project levels
    levels: {
        'lib/bem-core/common.blocks': {
            // `naming` — file naming scheme
            naming: 'two-dashes'
        },
        'common.blocks': {
            // `scheme` — file system scheme
            scheme: 'nested'
        }
    }
};
```

Specify either the file naming scheme or the file system type for each level. This lets you get information about BEM entities [using their names]( https://en.bem.info/toolbox/sdk/bem-naming/#string-representation) or using the names of files and directories.

The table shows the possible values that can be set for each of the schemes.

| Key | Scheme | Default value | Possible values |
|----|------|-----|----------|
| `naming` | File naming.|`origin`| `origin`, `two-dashes`|
| `scheme` | File system.|`nested`|`nested`, `flat`|

More information:
* [ bem-naming]( https://en.bem.info/toolbox/sdk/bem-naming/)
* [ bem-fs-scheme]( https://en.bem.info/toolbox/sdk/bem-fs-scheme/)

**Note** Instead of defining the project's levels manually, use the [` bem-config`]( https://en.bem.info/toolbox/sdk/bem-config/) tool.

```js
const config = require('bem-config')();
const levelMap = config.levelMapSync();
const stream = walk(levels, levelMap);
```

### 4. Define the paths to traverse

Specify the paths to walk in the `levels` object.

Path options:

* Relative to the root directory.

  ```js
  const levels = [
      'libs/bem-core/common.blocks',
      'common.blocks'
  ];
  ```

* Absolute.

  ```js
  const levels = [
      '/path/to/project/lib/bem-core/common.blocks',
      '/path/to/project/common.blocks'
  ];
  ```

### 5. Get information about found files

Pass the walk() method the `levels` and `config` objects.

Streaming is used for getting data about found files. When a portion of data is received, the `data` event is generated and [information about the found file](#output-data) is added to the `files` array. If an error occurs, `bem-walk` stops processing the request and returns a response containing the error ID and description. The `end` event occurs when all the data has been received from the stream.

```js
const files = [];

const stream = walk(levels, config);
// adds information about a found file to the end of the "files" array
stream.on('data', file => files.push(file));

stream.on('error', console.error);

stream.on('end', () => console.log(files));
```
### Complete code sample

When all these steps have been completed, the full code of the JavaScript file should look like this:

```js
const walk = require('bem-walk');
const config = require('bem-config')();
const levels = [
    'libs/bem-components/common.blocks',
    'common.blocks'
];
const files = [];

const stream = walk(levels, {
        levels: config.levelMapSync()
    })
    .on('data', file => files.push(file))
    .on('error', console.error)
    .on('end', () => console.log(files));
```

**Note** This sample uses the `bem-config` package.

## API

### walk method

` walk(levels, config);`

#### Description

Traverses the directories described in the `levels` parameter and returns `stream.Readable`.

#### Input parameters

Requirements for the search are defined in the `levels` and `config` parameters.

| Parameter | Type | Description |
|----------|-----|----------|
|**levels**|`string[]`|Paths to traverse|
|**config**|`object`|Project levels|

#### Output data

Readable stream (`stream.Readable`) that has the following events:

| Event | Description |
|----------|-----|
|'data'|Returns a JavaScript object with information about a found file. </br></br>The example below shows a JSON interface with elements that are in the response for the `walk` method. Objects and keys have sample values.</br></br> **Example** </br></br><code> {</code></br><code>"entity": { "block": "page" },</code></br><code> "level": "libs/bem-core/desktop.blocks",</code></br><code>"tech": "bemhtml",</code></br><code>"path": "libs/bem-core/desktop.blocks/page/page.bemhtml.js"</code></br><code>}</code></br></br>`entity` — BEM entity.</br>`level` — Directory path.</br>`tech` — Implementation technology.</br>`path` — Relative path to the file.|
| 'error' | Generated if an error occurred while traversing the levels. Returns an object with the error description.|
| 'end' | Generated when `bem-walk` finishes traversing the levels defined in the `levels` object. |

## Usage examples

Typical tasks that use the resulting JavaScript objects:
* [Grouping](#grouping)
* [Filtering]( #filtering)
* [Data transformation](#transformation)

### Grouping

> Grouping found files by block name.

```js
const walk = require('bem-walk');
const config = require('bem-config')();
const util = require('util');
const levels = [
    'libs/bem-components/common.blocks',
    'common.blocks'
];
const groups = {};

const stream = walk(levels, {
        levels: config.levelMapSync()
    })
    .on('data', file => {
        // Getting the block name for a found file.
        const block = file.entity.block;

        // Adding information about the found file.
        (groups[block] = []).push(file);
    })
    .on('error', console.error)
    .on('end', () => console.log(util.inspect(groups, {
        depth: null
    })));

/*
{ button:
   [ { entity: { block: 'button', modName: 'togglable', modVal: 'radio' },
       tech: 'spec.js',
       path: 'libs/bem-components/common.blocks/button/_togglable/
       button_togglable_radio.spec.js',
       level: 'libs/bem-components/common.blocks' } ],
 ...
}
*/
```

### Filtering

> Finding files for the `popup` block.

```js
const walk = require('bem-walk');
const config = require('bem-config')();
const levels = [
    'libs/bem-components/common.blocks',
    'common.blocks'
];
const files = [];

const stream = walk(levels, {
        levels: config.levelMapSync()
    })
    .on('data', file => {
        // Getting the block name for a found file.
        const block = file.entity.block;

        // Adding information about the found file.
        if (block == 'popup') {
            files.push(file);
        }
    })
    .on('error', console.error)
    .on('end', () => console.log(files));

/*
[{ entity: { block: 'popup', modName: 'target', modVal: true },
   tech: 'js',
   path: 'libs/bem-components/common.blocks/popup/_target/popup_target.js',
   level: 'libs/bem-components/common.blocks' },
...
]
*/
```

### Transformation

> Finding BEM files, reading the contents, and creating the new `source` property.

```js
const fs = require('fs');
const walk = require('bem-walk');
const config = require('bem-config')();
const stringify = require('JSONStream').stringify;
const through2 = require('through2');
const levels = [
    'libs/bem-components/common.blocks',
    'common.blocks'
];

const stream = walk(levels, {
        levels: config.levelMapSync()
    })
    .pipe(through2.obj(function(file, enc, callback) {
        try {
            // Certain technologies (for example, `i18n`) might be directories instead of files.
            if (fs.statSync(file.path).isFile()) {
                // Writing the file content to the `source` field.
                file.source = fs.readFileSync(file.path, 'utf-8');
                this.push(file);
            }

        } catch (err) {
            callback(err);
        }
    }))
    .pipe(stringify())
    .pipe(process.stdout);

/*
[{"entity":{"block":"search","elem":"header"},
  "tech":"css",
  "path":"common.blocks/search/__header/search__header.css",
  "level":"common.blocks",
  "source":".search__header {\n\tdisplay: block;\n\tfont-size: 20px;\n\tcolor:
  rgba(0,0,0,0.84);\n\tmargin: 0;\n\tpadding: 0 0 16px;\n\n}\n\n"},
...
]
*/
```
