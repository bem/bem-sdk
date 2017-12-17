# BemFile

[![NPM Status][npm-img]][npm]

[npm]:          https://www.npmjs.org/package/@bem/sdk.file
[npm-img]:      https://img.shields.io/npm/v/@bem/sdk.file.svg

Representation of [BEM Entity realisation](https://en.bem.info/methodology/key-concepts/#bem-entity) on FS.

Install
-------

```sh
$ npm install --save @bem/sdk.file
```

Usage
-----

```js
const BemFile = require('@bem/sdk.file');
const BemCell = require('@bem/sdk.cell');

const file = new BemFile({
    cell: BemCell.create({
        block: 'button',
        elem: 'text',
        mod: { name: 'theme', val: 'simple' },
        tech: 'css',
        layer: 'desktop'
    }),
    level: 'node_modules/bem-components',
    path: 'node_modules/bem-components/desktop.blocks/button/__text/_theme/button__text_theme_simple.css'
});

file.cell;   // ➜ BemCell { entity: BemEntityName { … }, layer: 'desktop', tech: 'css' }
file.level;  // node_modules/bem-components
file.path;   // node_modules/bem-components/desktop.blocks/button/__text/_theme/button__text_theme_simple.css

file.entity; // ➜ BemEntityName { block: 'button', elem: 'text', mod: { name: 'theme', val: 'simple' } }
file.layer;  // desktop
file.tech;   // css
```

API
---

* [constructor(obj)](#constructorobj)
* [cell](#cell)
* [level](#level)
* [path](#path)
* [entity](#entity)
* [tech](#tech)
* [layer](#layer)
* [id](#id)
* [toString()](#tostring)
* [valueOf()](#valueof)
* [toJSON()](#tojson)
* [isEqual(file)](#isequalfile)
* [isBemFile(file)](#isbemfilefile)
* [create(object)](#createobject)

### constructor(obj)

Parameter     | Type            | Description
--------------|-----------------|------------------------------
`obj.cell`    | `BemCell`       | Representation of cell
`obj.level`   | `string`        | Level (base directory)
`obj.path`    | `string`        | Path to a file in level's scheme

### cell

Returns the cell of the file.

```js
const BemFile = require('@bem/sdk.file');
const BemCell = require('@bem/sdk.cell');

const file = new BemFile({
    cell: BemCell.create({ block: 'button', elem: 'text', tech: 'css' })
});

file.cell; // ➜ BemCell { entity: BemEntityName { block: 'button', elem: 'text' }, tech: 'css' }
```

### level

Returns the path to level of the file.

```js
const BemFile = require('@bem/sdk.file');
const BemCell = require('@bem/sdk.cell');

const file = new BemFile({
    cell: BemCell.create({
        block: 'button',
        elem: 'text',
        layer: 'desktop'
    }),
    level: 'node_modules/bem-components'
});

cell.level; // ➜ 'node_modules/bem-components'
```

### path

Returns the path to the file.

```js
const BemFile = require('@bem/sdk.file');
const BemCell = require('@bem/sdk.cell');

const file = new BemFile({
    cell: BemCell.create({
        block: 'button',
        elem: 'text',
        tech: 'css'
    }),
    level: 'node_modules/bem-components',
    path: 'node_modules/bem-components/desktop.blocks/button/__text/button__text.css'
});

cell.path; // ➜ 'node_modules/bem-components/desktop.blocks/button/__text/button__text.css'
```

### tech

Returns the tech of the file.

```js
const BemFile = require('@bem/sdk.file');
const BemCell = require('@bem/sdk.cell');

const file = new BemFile({
    cell: BemCell.create({
        block: 'button',
        tech: 'css'
    })
});

file.tech; // ➜ 'css'
```

### layer

Returns the layer of the file.

```js
const BemFile = require('@bem/sdk.file');
const BemCell = require('@bem/sdk.cell');

const file = new BemFile({
    cell: BemCell.create({
        block: 'button',
        layer: 'desktop'
    })
});

file.layer; // ➜ desktop
```

### id

Returns the identifier of the file.

**Important:** should only be used to determine uniqueness of file.

```js
const BemFile = require('@bem/sdk.file');
const BemCell = require('@bem/sdk.cell');

const file = new BemFile({
    cell: BemCell.create({
        block: 'button',
        elem: 'text',
        tech: 'css',
        layer: 'desktop'
    }),
    level: 'node_modules/bem-components',
    path: 'desktop.blocks/button_focused.css'
});

file.id; // ➜ "desktop.blocks/button__text@desktop.css"
```

### toString()

Returns a string representing the file.

```js
const BemFile = require('@bem/sdk.file');
const BemCell = require('@bem/sdk.cell');
const file = new BemFile({
    cell: BemCell.create({
        block: 'button',
        mod: 'focused',
        tech: 'css',
        layer: 'desktop'
    }),
    level: 'node_modules/bem-components',
    path: 'desktop.blocks/button_focused.css'
});

file.toString(); // desktop.blocks/button_focused@desktop.css
```

### valueOf()

Returns an object representing this cell.

```js
const BemFile = require('@bem/sdk.file');
const BemCell = require('@bem/sdk.cell');
const file = new BemFile({
    cell: BemCell.create({
        block: 'button',
        mod: 'focused',
        tech: 'css',
        layer: 'desktop'
    }),
    level: 'node_modules/bem-components',
    path: 'desktop.blocks/button_focused.css'
});

file.valueOf();

// ➜ { cell: {
//        entity: { block: 'button', mod: { name: 'focused', value: true } },
//        tech: 'css',
//        layer: 'desktop'
//      },
//      level: 'node_modules/bem-components',
//      path: 'desktop.blocks/button_focused.css' }
```

### toJSON()

Returns an object for `JSON.stringify()` purpose.

### isEqual(file)

Determines whether specified file is deep equal to file or not.

Parameter | Type            | Description
----------|-----------------|-----------------------
`file`    | `BemFile`       | The file to compare.

```js
const BemFile = require('@bem/sdk.file');
const buttonFile1 = BemFile.create({ block: 'button', tech: 'css', layer: 'desktop', path: 'desktop/button.css' });
const buttonFile2 = BemFile.create({ block: 'button', tech: 'css', layer: 'desktop', path: 'desktop/button.css' });
const inputFile = BemFile.create({ block: 'input', tech: 'css', layer: 'common', path: 'common/input.css' });

buttonFile1.isEqual(buttonFile2); // true
buttonFile1.isEqual(inputFile); // false
```

### #isBemFile(file)

Determines whether specified cell is instance of BemFile.

Parameter | Type            | Description
----------|-----------------|-----------------------
`file`    | `BemFile`       | The file to check.

```js
const BemFile = require('@bem/sdk.file');

const file = BemFile.create({
    entity: { block: 'button', elem: 'text' },
    tech: 'css',
    path: 'button__text.css'
});

BemFile.isBemFile(file); // true
BemFile.isBemFile({}); // false
```

### #create(object)

Creates BemFile instance by any object representation.

Helper for sugar-free simplicity.

Parameter    | Type     | Description
-------------|----------|--------------------------
`object`     | `object` | Representation of entity name.

Passed Object could have fields for BemEntityName and cell itself:

Object field | Type     | Description
-------------|----------|------------------------------
`block`      | `string` | The block name of entity.
`elem`       | `string` | The element name of entity.
`mod`        | `string`, `object` | The modifier of entity.<br><br> If specified value is `string` then it will be equivalent to `{ name: string, val: true }`.
`val`        | `string` | The modifier value of entity. Used if `mod` is a string.
`mod.name`   | `string` | The modifier name of entity.
`mod.val`    | `*`      | The modifier value of entity.
`modName`    | `string` | The modifier name of entity. Used if `mod.name` wasn't specified.
`modVal`     | `*`      | The modifier value of entity. Used if neither `mod.val` nor `val` were not specified.
`tech`       | `string` | Technology of cell.
`layer`      | `string` | Layer of cell.
`level`      | `string` | Base path to level.
`path`       | `string` | Path to the file on fs.

```js
const BemFile = require('@bem/sdk.file');

BemFile.create({ block: 'my-button', tech: 'css', path: 'my-button.css' });
BemFile.create({ cell: { entity: { block: 'my-button' }, tech: 'css' }, path: 'my-button.css' }); // valueOf() format
// → BemFile { cell: { entity: { block: 'my-button' }, tech: 'css' }, path: 'my-button.css' }
```

Debuggability
-------------

In Node.js, `console.log()` calls `util.inspect()` on each argument without a formatting placeholder.

`BemCell` has `inspect()` method to get custom string representation of the object.

```js
const BemFile = require('@bem/sdk.file');
const BemCell = require('@bem/sdk.cell');

const file = new BemFile({
    cell: BemCell.create({ block: 'input', mod: 'available', tech: 'css' }),
    level: 'blocks',
    path: 'blocks/input_mod.css'
});

console.log(file);

// ➜ BemFile {
//     cell: { entity: { block: 'input', mod: { name: 'available' } }, tech: 'css' },
//     path: 'my-button.css'
//   }
```

You can also convert `BemFile` object to a `string`.

```js
const BemFile = require('@bem/sdk.file');
const BemCell = require('@bem/sdk.cell');

const file = new BemFile({
    cell: BemCell.create({ block: 'input', mod: 'available', layer: 'common', tech: 'css' }),
    level: 'common.blocks'
});

console.log(`file: ${file}`);

// ➜ file: common.blocks/input_mod@common.css
```

Also `BemFile` has `toJSON` method to support `JSON.stringify()` behaviour.

```js
const BemFile = require('@bem/sdk.file');
const BemCell = require('@bem/sdk.cell');

const file = new BemFile({
    cell: BemCell.create({ block: 'input', mod: 'available', layer: 'desktop', tech: 'css' }),
    level: 'node_modules/bem-components'
});

console.log(JSON.stringify(file, null, 2));

// ➜ {
//     "cell": {
//       "entity": {
//         "block": "input",
//         "mod": {
//           "name": "available",
//           "val": true
//         }
//       },
//       "tech": "css",
//       "layer": "desktop"
//     },
//     "level": "desktop.blocks"
//   }
```

Deprecation
-----------

Deprecation is performed with [depd](https://github.com/dougwilson/nodejs-depd)
To silencing deprecation warnings from being output simply use this. [Details](https://github.com/dougwilson/nodejs-depd#processenvno_deprecation)
```
NO_DEPRECATION=@bem/sdk.file node app.js
```

License
-------

Code and documentation © 2016 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
