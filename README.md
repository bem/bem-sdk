# bem-config

## Usage

```js
var Config = require('bem-config');
var optionalConfig = { plugins: { create: { techs: ['styl', 'browser.js'] } } };
var config = Config(options); // promise
    options.projectRoot // process.cwd()
    options.config // extend found bemconf with this obj

## API

```js
config.getAll().then(function(all) {
    all.merged: {}  // is a merge of CLI args + optionalConfig + all configs found by rc

    all.configs: [] // all the configs found
});

config.getConfig('path/to/level').then(function(levelConf) {
    levelConf // merged opts for resolved level
});

config.getModuleConfig('moduleName').then(function(moduleConf) {
    moduleConf // opts for moduleName
});
```

## Config example

```json
{
    "root": true,
    "levels": {
        "path/to/level": {
            "scheme": "nested"
        }
    },
    "modules": {
        "bem-tools": {
            "plugins": {
                "create": {
                    "techs": [
                        "css", "js"
                    ],
                    "templateFolder": "/Users/tadatuta/Sites/bem/bem-tools-create/templates",
                    "templates": {
                        "js-ymodules": "/Users/tadatuta/Sites/bem/bem-tools-create/templates/js"
                    },
                    "techsTemplates": {
                        "js": "js-ymodules"
                    },
                    "levels": {
                        "path/to/level": {
                            "techs": ["bemhtml.js", "trololo.olo"]
                        }
                    }
                }
            }
        }
    }
}
```

`levels` override common options.
