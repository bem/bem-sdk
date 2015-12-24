# bem-config

## Usage

```js
var config = require('bem-config');
var optionalConfig = { plugins: ['css', 'js'] };

config(optionalConfig);

// {
//   global: {},   // ~/.bemconf.json
//   local: {},    // nearestParentDirWithConf/bemconf.json
//   extended: {}  // Object.assign(global, local, optionalConfig)
// }

var isGlobal = true;

config.getConfigFilename(); // 'bemconf.json'
config.getConfigFilename(isGlobal); // '.bemconf.json'
config.getGlobalConfigPath(); // '~/.bemconf.json'
```

## Config example

```json
{
  "root": true,
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
  "levels": [
      "path/to/level"
  ],
  "levelsOpts": {
     "path/to/level": {
          "techs": ["bemhtml.js", "trololo.olo"],
          "scheme": "nested"
      }
  }
}
```


`levelOpts` override common options.
