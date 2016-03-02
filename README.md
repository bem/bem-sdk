# bem-config

## Usage

```js
var config = require('bem-config');
var optionalConfig = { plugins: { create: { techs: ['styl', 'browser.js'] } } };

config(optionalConfig);

// {
//   merged: {}  // is a merge of CLI args + optionalConfig + all configs found by `rc`
// }

config.getLevel('path/to/level'); // merged opts for resolved level
config.getModule('moduleName'); // opts for moduleName

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
