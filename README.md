# bem-config

## Usage

```
require('bem-config')({ plugins: ['css', 'js'] });

// {
//   global: {},   // ~/.bem/config.json
//   local: {},    // nearestParentDirWithConf/.bem/config.json
//   extended: {}  // util._extend(global, local)
// }
```

## Config example

```json
{
  "plugins": [
    "make"
  ],
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
