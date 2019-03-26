# config

The tool allows you to get a [BEM](https://en.bem.info) project's settings.

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

Config allows you to get a [BEM](https://en.bem.info) project's settings from a configuration file (for example `.bemrc` or `.bemrc.js`).

The configuration file can contain:

* Redefinition levels of BEM project.
* An array of options to the libraries used.
* An array of options to the modules used.
* The level's sets.

## Installation

To install the `@bem/sdk.config` package, run the following command:

```bash
$ npm install --save @bem/sdk.config
```

## Try config

An example is available in the [RunKit editor](https://runkit.com/godfreyd/5c49aa32363af80012a409bf).

## Quick start

> **Attention.** To use `@bem/sdk.config`, you must install [Node.js 8.0+](https://nodejs.org/en/download/).

Use the following steps after [installing the package](#installation).

To run the `@bem/sdk.config` package:

1. [Include the package](#including-the-bemsdkconfig-package).
1. [Define the project's configuration file](#defining-the-projects-configuration-file).
1. [Get the project's settings](#getting-the-projects-settings).

### Including the `@bem/sdk.config` package

Create a JavaScript file with any name (for example, **app.js**) and insert the following:

```js
const config = require('@bem/sdk.config')();
```

> **Note.** Use the same file for step [Getting the project's settings](#getting-the-projects-settings).

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

Call an asynchronous method `get()` to get the project's settings.

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

Config options. The config options can be used to make settings for the config itself. Options are optional and listed below.

```js
const config = require('@bem/sdk.config');
/**
 * Constructor.
 * @param {Object} [options] — Object.
 * @param {String} [options.name='bem'] — Config filename. This option is converted to `rc` file and config traverse different variations of file formats (for example `.bemrc`, `.bemrc.js`, `.bemrc.json`).
 * @param {String} [options.cwd=process.cwd()] — Project's root directory.
 * @param {Object} [options.defaults={}] — Use this object as fallback for found configs.
 * @param {String} [options.pathToConfig] — Custom path to config on FS via command line argument `--config`.
 * @param {String} [options.fsRoot] — Custom root directory.
 * @param {String} [options.fsHome] — Custom `$HOME` directory.
 * @param {Object} [options.plugins] — An array of paths to plugins to require.
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
const bemConfig = config({cwd: 'src'}); // You should put `rc` file to `src` folder.
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

Sets the custom path to config on file system via command line argument `--config`.

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

Sets the array of paths to plugins to require.

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
* all configs found by `rc` configuration file.

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

Returns an array of levels for the level set.

```js
const config = require('@bem/sdk.config')();
config.levels('desktop').then(desktopSet => {
    console.log(desktopSet);
});
```

[RunKit live editor](https://runkit.com/godfreyd/5c4e1d3c699268001518d980).

### levelMap()

Returns all levels hash with their options.

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
* all configs found by `rc` configuration file.

```js
const config = require('@bem/sdk.config')();
const conf = config.getSync();
console.log(conf);
```

[RunKit live editor](https://runkit.com/godfreyd/5c4ecfb4b39f9a00142f5e4a).

### librarySync()

Returns the path to the library config to get. To get config, use [`getSync()`](#getsync) method.

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

Returns an array of levels configs for the level set.

> **Note.** This is a sync function because we have all the data.

```js
const config = require('@bem/sdk.config')();
const desktopSet = config.levelsSync('desktop');
console.log(desktopSet);
```

[RunKit live editor](https://runkit.com/godfreyd/5c4f0478cf562000133b804e).

### levelMapSync()

Returns all levels hash with their options.

```js
const config = require('@bem/sdk.config')();
const levelMap = config.levelMapSync();
console.log(levelMap);
```

[RunKit live editor](https://runkit.com/godfreyd/5c4ed826b39f9a00142f68fa).

### moduleSync()

Returns merged config for required module.

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
        // Will use `touch-phone` set from bem-components and few local levels.
        'touch-phone': '@bem-components/touch-phone common touch touch-phone',
        'touch-pad': '@bem-components common deskpad touch touch-pad',
        // Will use `desktop` set from `bem-components`, and also few local levels.
        'desktop': '@bem-components common deskpad desktop',
        // Will use mix of levels from `desktop` and `touch-pad` level sets from `core`, `bem-components` and locals.
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
