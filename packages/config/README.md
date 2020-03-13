# config

This tool allows you to get a [BEM](https://en.bem.info) project's settings.

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.com/package/@bem/sdk.config
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.config.svg

* [Introduction](#introduction)
* [Installation](#installation)
* [Try config](#try-config)
* [Quick start](#quick-start)
* [Options](#options)
* [Async API reference](#async-api-reference)
* [Sync API reference](#sync-api-reference)
* [.bemrc file example](#bemrc-file-example)

## Introduction

Config allows you to get a [BEM](https://en.bem.info) project's settings from a configuration file (for example, `.bemrc` or `.bemrc.js`).

The configuration file can contain:

* Redefinition levels of the BEM project.
* An array of options for the libraries used.
* An array of options for the modules used.
* The level sets.

## Installation

To install the `@bem/sdk.config` package, run the following command:

```bash
$ npm install --save @bem/sdk.config
```

## Try config

An example is available in the [RunKit editor](https://runkit.com/godfreyd/5c49aa32363af80012a409bf).

## Quick start

> **Attention.** To use `@bem/sdk.config`, you must install [Node.js 8.0+](https://nodejs.org/en/download/).

First [install the `@bem/sdk.config` package](#installation).

To run the package, follow these steps:

1. [Include the package in the project](#including-the-bemsdkconfig-package).
1. [Define the project's configuration file](#defining-the-projects-configuration-file).
1. [Get the project's settings](#getting-the-projects-settings).

### Including the `@bem/sdk.config` package

Create a JavaScript file with any name (for example, **app.js**) and insert the following:

### `.bemrc` fields

Field   | Type    | Purpose
---     | ---     | ---
root    | `Boolean` | Used to determine the root directory. Configs in parent dirs won't be gathered
naming  | `string`, `Object` | Name of one of [naming presets](https://github.com/bem/bem-sdk/tree/master/packages/naming.presets) or custom naming definition
levels  | `Array<LevelConf>` | List of known levels in the right order<br> (usually local) with their configurations
sets    | `Object<string, SetConf>` | Named sets of layers to build
libs    | `Object<string, LibraryConf>` | Dependency libraries to use in sets
plugins | `Object<string, PluginConf>` | Various configurations for plugins,<br>can be reached via [`.module`](#module) method

#### `root`

For the following file structure
```
/
    projects/
        prj1/
            .bemrc
        .bemrc
    .bemrc
```
and `/projects/prj1/` as current working directory `root` option set to `true` in `/projects/prj1/.bemrc` will prevent `bem-config` to collect data from `/projects/.bemrc` and `/.bemrc`.

#### `LevelConf`

Describes [redefinition level](https://en.bem.info/methodology/key-concepts/#redefinition-level) with sources — a set of layers relative to library path (`.bemrc` location)
and depends on naming preset. E.g. `common` and `desktop` for `bem-components/` (library) path and [`origin`](https://github.com/bem/bem-sdk/blob/master/packages/naming.presets/origin.js) preset.

Usualy it represents a directory for a single layer — e.g. `bem-components/common.blocks/` for `common` or `bem-components/desktop.blocks/` for `desktop`.

- `layer` - name of level‘s layer to use in `sets` option
- `naming` - naming preset for this level
- `path` - optional, deprecated. Required for legacy way, unwanted for the modern one
- the rest fields will be passed to level config (if required by some custom consumer)

##### Example
```js
{
    "levels": [
        {
            "layer": "common",
            "naming": "origin",
            "scheme": "nested"
        }
    ]
}
```

#### `SetConf`

`string|Array<string|{library: string, set?: string}>`

One of:
- single string with all used layers; e.g. `'bem-core@ common deskpad desktop'`
- list of layers and/or libraries and library sets; e.g. `[{library: 'bem-core'}, 'common', 'deskpad', 'desktop']`

#### `LibraryConf`

- `path` - path (repeating is okey) to library. Library should contain its own .bemrc file. If omitted path is evaluated to node_modules/${libraryName}
- the rest fields will be passed to library config and extend `.bemrc` config found at `${path}/.bemrc`

#### `PluginConf`

- all the fields will be passed directly to plugins

## API

```js
const config = require('@bem/sdk.config')();
```

> **Note.** Use the same file for the [Getting the project's settings](#getting-the-projects-settings) step.

### Defining the project's configuration file

Specify the project's settings in the project's configuration file. Put it in the application's root directory.

**.bemrc.js file example:**

```js
module.exports = {
    // Root directory for traversing `rc` files and collecting configs.
    root: true,
    // Project levels.
    levels: {
        'common.blocks': {},
        'desktop.blocks': {}
    },
    // Modules.
    modules: {
        'bem-tools': {
            plugins: {
                create: {
                    techs: ['css', 'js']
                }
            }
        }
    }
}
```

### Getting the project's settings

Call the asynchronous `get()` method to get the project's settings.

**app.js file:**

```js
const config = require('@bem/sdk.config')();
/**
 * Config is a merge of:
 * - an optional configuration object (see `options.defaults`);
 * - all configs found by `rc` configuration files.
 **/
config.get().then((conf) => {
    console.log(conf);
});
/**
 *
 * {
 *   root: true,
 *   levels: [
 *     {path: 'common.blocks'},
 *     {path: 'desktop.bundles'}],
 *   modules: {
 *      'bem-tools': {plugins: {create: {techs: ['css', 'js']}}}},
 *   __source: '.bemrc'
 * }
 *
 **/
```

## Options

Config options listed below can be used to create settings for the config itself. They are optional.

```js
const config = require('@bem/sdk.config');
/**
 * Constructor.
 * @param {Object} [options] — Object.
 * @param {String} [options.name='bem'] — Config filename. `rc` is appended to the filename, and the config traverses files with this name with any extension (for example `.bemrc`, `.bemrc.js`, `.bemrc.json`).
 * @param {String} [options.cwd=process.cwd()] — Project's root directory.
 * @param {Object} [options.defaults={}] — Found configs are merged with this object.
 * @param {String} [options.pathToConfig] — Custom path to the config in FS via the `--config` command line argument.
 * @param {String} [options.fsRoot] — Custom root directory.
 * @param {String} [options.fsHome] — Custom `$HOME` directory.
 * @param {Object} [options.plugins] — An array of paths to the required plugins.
 * @param {Object} [options.extendBy] — Extensions.
 * @constructor
 */
const bemConfig = config([options]);
```

* [options.name](#optionsname)
* [options.cwd](#optionscwd)
* [options.defaults](#optionsdefaults)
* [options.pathToConfig](#optionspathtoconfig)
* [options.fsRoot](#optionsfsroot)
* [options.fsHome](#optionsfshome)
* [options.plugins](#optionsplugins)
* [options.extendBy](#optionsextendby])

### options.name

Sets the configuration filename. The default value is `bem`.

**Example:**

```js
const config = require('@bem/sdk.config');
const bemConfig = config({name: 'app'});
bemConfig.get().then(conf => {
    console.log(conf);
});
```

[RunKit live editor](https://runkit.com/godfreyd/5c4b1a6688fe04001b861555).

### options.cwd

Sets the project's root directory. The name of the desired resource relative to your app root directory.

**Example:**

```js
const config = require('@bem/sdk.config');
const bemConfig = config({cwd: 'src'}); // Put the `rc` file into the `src` folder.
bemConfig.get().then(conf => {
    console.log(conf);
});
```

[RunKit live editor](https://runkit.com/godfreyd/5c4c7248cef4710014fe8d8a).

### options.defaults

Sets the additional project configuration.

**Example:**

```js
const config = require('@bem/sdk.config');
const optionalConfig = { defaults: [{
    levels: {
            'common.blocks': {},
            'desktop.blocks': {}
        }
    }
]};
const projectConfig = config(optionalConfig);
projectConfig.get().then(conf => {
    console.log(conf);
});
```

[RunKit live editor](https://runkit.com/godfreyd/5c4c77855a0ab10012cc46d5).

### options.pathToConfig

Sets the custom path to the config in file system via the `--config` command line argument.

**Example:**

```js
const config = require('@bem/sdk.config');
const bemConfig = config({pathToConfig: 'src/configs/.app-rc.json'});
bemConfig.get().then(conf => {
    console.log(conf);
});
```

[RunKit live editor](https://runkit.com/godfreyd/5c51614099b140001260bd0e).

### options.fsRoot

Sets the custom root directory. The path to the desired resource is relative to your app root directory.

**Example:**

```js
const config = require('@bem/sdk.config');
const bemConfig = config({fsRoot: '/app', cwd: 'src/configs'});
bemConfig.get().then(conf => {
    console.log(conf);
});
```

[RunKit live editor](https://runkit.com/godfreyd/5c516f8444f90b00137fefd1).

### options.fsHome

Sets the custom `$HOME` directory.

**Example:**

```js
const config = require('@bem/sdk.config');
const bemConfig = config({fsHome: 'src'});
bemConfig.get().then(conf => {
    console.log(conf);
});
```

[RunKit live editor](https://runkit.com/godfreyd/5c4ede68cf562000133b547f).

### options.plugins

Sets the array of paths to the required plugins.

**Example:**

```js
const config = require("@bem/sdk.config");
const optionalConfig = { defaults: [{ plugins: { create: { techs: ['styl', 'browser.js']}}}]};
const bemConfig = config(optionalConfig);
bemConfig.get().then(conf => {
    console.log(conf);
});
```

[RunKit live editor](https://runkit.com/godfreyd/5c4f0d74699268001519acc8).

### options.extendBy

Sets extensions.

**Example:**

```js
const config = require('@bem/sdk.config');
const bemConfig = config({
    extendBy: {
        levels: [
            { path: 'path/to/level', test: 1 }
        ],
        common: 'overriden',
        extended: 'yo'
    }
});
bemConfig.get().then(conf => {
    console.log(conf);
});
```

[RunKit live editor](https://runkit.com/godfreyd/5c516adb99b140001260c7be).

## Async API reference

### get()

Returns the extended project configuration merged from:

* an optional configuration object from [options.defaults](#optionsdefaults);
* all configs found by the `rc` configuration file.

```js
const config = require('@bem/sdk.config')();
config.get().then(conf => {
    console.log(conf);
});
```

[RunKit live editor](https://runkit.com/godfreyd/5c4adeece7a1a70012db06e8).

### library()

Returns the library config.

```js
const config = require('@bem/sdk.config')();
config.library('bem-components').then(libConf => {
    console.log(libConf);
});
```

[RunKit live editor](https://runkit.com/godfreyd/5c4db299cf562000133a5576).

### level()

Returns the merged level config.

```js
const config = require('@bem/sdk.config')();
config.level('path/to/level').then(levelConf => {
    console.log(levelConf);
});
```

[RunKit live editor](https://runkit.com/godfreyd/5c4da379cf562000133a47b2).

### levels()

Returns an array of levels for the set of levels.

```js
const config = require('@bem/sdk.config')();
config.levels('desktop').then(desktopSet => {
    console.log(desktopSet);
});
```

[RunKit live editor](https://runkit.com/godfreyd/5c4e1d3c699268001518d980).

### levelMap()

Returns a hash of all levels with their options.

```js
const config = require('@bem/sdk.config')();
config.levelMap().then(levelMap => {
    console.log(levelMap);
});
```

[RunKit live editor](https://runkit.com/godfreyd/5c4e24d94ea3a50012e5931d).

### module()

Returns merged config for the required module.

```js
const config = require('@bem/sdk.config')();
config.module('bem-tools').then(bemToolsConf => {
    console.log(bemToolsConf);
});
```

[RunKit live editor](https://runkit.com/godfreyd/5c4e268d4ea3a50012e594fd).

### configs()

Returns all found configs from all dirs.

> **Note.** It is a low-level method that is required for working with each config separately.

```js
const config = require('@bem/sdk.config')();
config.configs().then(configs => {
    console.log(configs);
});
```

[RunKit live editor](https://runkit.com/godfreyd/5c4e2d714ea3a50012e59add).

## Sync API reference

### getSync()

Returns the extended project configuration merged from:

* an optional configuration object from [options.defaults](#optionsdefaults);
* all configs found by the `rc` configuration file.

```js
const config = require('@bem/sdk.config')();
const conf = config.getSync();
console.log(conf);
```

[RunKit live editor](https://runkit.com/godfreyd/5c4ecfb4b39f9a00142f5e4a).

### librarySync()

Returns the path to the library config. To get the config, use the [`getSync()`](#getsync) method.

```js
const config = require('@bem/sdk.config')();
const libConf = config.librarySync('bem-components');
console.log(libConf);
```

[RunKit live editor](https://runkit.com/godfreyd/5c4ed04bb39f9a00142f5f8b).

### levelSync()

Returns the merged level config.

```js
const config = require('@bem/sdk.config')();
const levelConf = config.levelSync('path/to/level');
console.log(levelConf);
```

[RunKit live editor](https://runkit.com/godfreyd/5c4ed6f5699268001519708c).

### levelsSync()

Returns an array of level configs for the set of levels.

> **Note.** This is a sync function because we have all the data.

```js
const config = require('@bem/sdk.config')();
const desktopSet = config.levelsSync('desktop');
console.log(desktopSet);
```

[RunKit live editor](https://runkit.com/godfreyd/5c4f0478cf562000133b804e).

### levelMapSync()

Returns a hash of all levels with their options.

```js
const config = require('@bem/sdk.config')();
const levelMap = config.levelMapSync();
console.log(levelMap);
```

[RunKit live editor](https://runkit.com/godfreyd/5c4ed826b39f9a00142f68fa).

### moduleSync()

Returns the merged config for the required module.

```js
const config = require('@bem/sdk.config')();
const bemToolsConf = config.moduleSync('bem-tools')
console.log(bemToolsConf);
```

[RunKit live editor](https://runkit.com/godfreyd/5c4ed876cf562000133b4cf7).

### configs()

Returns all found configs from all dirs.

> **Note.** It is a low-level method that is required for working with each config separately.

```js
const config = require('@bem/sdk.config')();
const configs = config.configs(true);
console.log(configs);
```

[RunKit live editor](https://runkit.com/godfreyd/5c4eda064ea3a50012e628fb).

## .bemrc file example

Example of the configuration file:

```js
module.exports = {
    // Root directory.
    'root': true,
    // Project levels. Override common options.
    'levels': [
        {
            'path': 'path/to/level',
            'scheme': 'nested'
        }
    ],
    // Project libraries.
    'libs': {
        'libName': {
            'path': 'path/to/lib'
        }
    },
    // Sets.
    'sets': {
        // Will use the `touch-phone` set from bem-components and a few local levels.
        'touch-phone': '@bem-components/touch-phone common touch touch-phone',
        'touch-pad': '@bem-components common deskpad touch touch-pad',
        // Will use the `desktop` set from `bem-components` and also a few local levels.
        'desktop': '@bem-components common deskpad desktop',
        // Will use a mix of levels from the `desktop` and `touch-pad` sets from `core`, `bem-components` and locals.
        'deskpad': 'desktop@core touch-pad@core desktop@bem-components touch-pad@bem-components desktop@ touch-pad@'
    },
    // Modules.
    'modules': {
        'bem-tools': {
            'plugins': {
                'create': {
                    'techs': [
                        'css', 'js'
                    ],
                    'templateFolder': 'path/to/templates',
                    'templates': {
                        'js-ymodules': 'path/to/templates/js'
                    },
                    'techsTemplates': {
                        'js': 'js-ymodules'
                    },
                    'levels': [
                        {
                            'path': 'path/to/level',
                            'techs': ['bemhtml.js', 'trololo.olo'],
                            'default': true
                        }
                    ]
                }
            }
        },
        'bem-libs-site-data': {
            'someOption': 'someValue'
        }
    }
}
```

## License

© 2019 [YANDEX LLC](https://yandex.com/company/). Code released under [Mozilla Public License 2.0](LICENSE.txt).
