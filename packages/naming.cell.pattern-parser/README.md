# naming.cell.pattern-parser

Thing to parse template-strings-like patterns.

## Install

```sh
npm i @bem/sdk.naming.cell.pattern-parser
```

## Usage

```js
const parse = require('@bem/sdk.naming.cell.pattern-parser');

parse('1/${some}/2/${more}/3');
// → ['1/', 'some', '/2/', 'more', '/3']

parse('${entity}${layer?@${layer}}.${tech}');
// → ['', 'entity', '', ['layer', '@', 'layer'], '.', 'tech']
```

### Options

Parameter                    | Type      | Description
-----------------------------|-----------|--------------
`pattern`                    | `string`  | Pattern to parse

License
-------

Code and documentation © 2017 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
