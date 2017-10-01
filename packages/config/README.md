# config

## Usage

```js
const bemConfig = require('@bem/sdk.config');
const optionalConfig = { plugins: { create: { techs: ['styl', 'browser.js'] } } };
const projectConfig = bemConfig(optionalConfig); // returns BemConfig instance
```

### options
All options are optional:

* `name` // base name for rc files. Default value is `bem`.
* `cwd` // Default value is `process.cwd()`.
* `defaults` // extends found configs with this object
* `pathToConfig` // custom path to config on FS
* `fsRoot` // custom '/' directory
* `fsHome` // custom $HOME directory
* `plugins` // array of paths to plugings to require

## Async API

### get

```js
const config = require('@bem/sdk.config')();
config.get().then(function(conf) {
    console.log(conf); // config is a merge of CLI args + optionalConfig + all configs found by rc
});
```

### level

```js
const config = require('@bem/sdk.config')();
config.level({ layer: 'common' }).then(function(levelConf) {
    console.log(levelConf); // merged level config
});

config.level({ layer: 'common', path: 'node_modules/bem-core' }).then(function(levelConf) {
    console.log(levelConf); // merged level config
});
```

### library

```js
const config = require('@bem/sdk.config')();
config.library('bem-components').then(function(libConf) {
    console.log(libConf); // library config
});
```

### levels
```js
const config = require('@bem/sdk.config')();

config.levels().then(allLevels) {
    console.log(allLevels); // an array of all levels from both project and library
}

config.levels('desktop').then(function(desktopSet) {
    console.log(desktopSet); // an array of levels configs for desktop set
});
```

### module

```js
const config = require('@bem/sdk.config')();
config.module('bem-tools').then(function(bemToolsConf) {
    console.log(bemToolsConf); // merged config for required module
});
```

### configs

```js
const config = require('@bem/sdk.config')();
config.configs().then(function(configs) {
    console.log(configs); // all found configs from all dirs
});
```

## Sync API

### getSync

```js
const config = require('@bem/sdk.config')();
const conf = config.getSync();
console.log(conf); // config is a merge of CLI args + optionalConfig + all configs found by rc
```

### levelSync

```js
const config = require('@bem/sdk.config')();
const levelConf = config.levelSync({ layer: 'common' });
console.log(levelConf); // merged level config

const otherLevelConf = config.levelSync({ layer: 'common', path: 'node_modules/bem-core' });
```

### librarySync

```js
const config = require('@bem/sdk.config')();
const libConf = config.librarySync('bem-components');
console.log(libConf); // library config
```

### levelsSync
```js
const config = require('@bem/sdk.config')();

const allLevels = config.levels();
console.log(allLevels); // an array of all levels from both project and library

const desktopSet = config.levels('desktop');
console.log(desktopSet); // an array of levels configs for desktop set
```

### moduleSync

```js
const config = require('@bem/sdk.config')();
const bemToolsConf = config.moduleSync('bem-tools')
console.log(bemToolsConf); // merged config for required module
```

### configs

```js
const config = require('@bem/sdk.config')();
const configs = config.configs(true);
console.log(configs); // all found configs from all dirs
```

## Config example

`.bemrc`:
```js
{
    "root": true,
    "levels": [
        {
            "path": "path/to/level",
            "scheme": "nested"
        }
    ],
    "libs": {
        "libName": {
            "path": "path/to/lib"
        }
    },
    "sets": {
        // Will use `touch-phone` set from bem-components and few local levels
        "touch-phone": "@bem-components/touch-phone common touch touch-phone",
        "touch-pad": "@bem-components common deskpad touch touch-pad",
        // Will use `desktop` set from `bem-components`, and also few local levels
        "desktop": "@bem-components common deskpad desktop",
        // Will use mix of levels from `desktop` and `touch-pad` level sets from `core`, `bem-components` and locals
        "deskpad": "desktop@core touch-pad@core desktop@bem-components touch-pad@bem-components desktop@ touch-pad@"
    },
    "modules": {
        "bem-tools": {
            "plugins": {
                "create": {
                    "techs": [
                        "css", "js"
                    ],
                    "templateFolder": "path/to/templates",
                    "templates": {
                        "js-ymodules": "path/to/templates/js"
                    },
                    "techsTemplates": {
                        "js": "js-ymodules"
                    },
                    "levels": [
                        {
                            "path": "path/to/level",
                            "techs": ["bemhtml.js", "trololo.olo"],
                            "default": true
                        }
                    ]
                }
            }
        },
        "bem-libs-site-data": {
            "someOption": "someValue"
        }
    }
}
```

`levels` override common options.

License
-------

Code and documentation © 2015-2017 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
