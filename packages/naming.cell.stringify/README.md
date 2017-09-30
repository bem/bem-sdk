# naming.cell.stringify

[BEM file system](https://en.bem.info/method/filesystem/#principles-of-file-system-organization-for-bem-projects) [schemes](https://en.bem.info/faq/#why-create-separate-directories-and-files-for-every-block-and-technology).

## Supported presets

### Naming conventions

[BEM naming convention](https://en.bem.info/methodology/naming-convention/).

* `origin` — `.btn__text_fly`, `btn/__text/_fly/btn__text_fly_away.css`
* `two-dashes` — `.btn__text--fly_away`, `btn/__text/--fly/btn__text--fly_away.css`
* `react` — `.Btn-Text_fly_away`, `Btn/Text/_fly/Btn-Text_fly_away.css`

### Schemes

* [`nested`](https://en.bem.info/methodology/filestructure/#nested)
* [`flat`](https://en.bem.info/methodology/filestructure/#flat)

## Usage

```js
const BemCell = require('@bem/sdk.cell');

const cell = BemCell.create({
    block: 'b1',
    elem: 'e1',
    mod: {name: 'm1', val: 'v1'},
    tech: 'js'
});

const stringify = require('@bem/sdk.naming.cell.stringify')('origin')

stringify(cell); // b1/__e1/_m1/b1__e1_m1_v1.js
```

### Options

`dirNaming` has meaning only for `nested` scheme.

Parameter                    | Type                | Description                                                         | Default
-----------------------------|---------------------|---------------------------------------------------------------------|--------------------------
`options`                    | `object`, `string`  |                                                                     | '"origin"'
`options.naming`             | `object`, `string`  | Defines delimeters and wordPattern check [@bem/naming]               | '"origin"'
`options.elemDirDelim`       | `string`            | Separates element's directory                                       | `"__"`
`options.modDirDelim`        | `string`            | Separates mod's directory                                           | `"_"`

Options could be one of these strings:

* "origin"
* "two-dashes"
* "react"

check `./lib/presets`


License
-------

Code and documentation © 2015-2017 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).


[@bem/naming] : https://github.com/bem/bem-sdk/tree/master/packages/naming#bemnaming-elem-mod-wordpattern-
