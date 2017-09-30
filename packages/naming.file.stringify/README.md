# naming.file.stringify

[BEM file system](https://en.bem.info/method/filesystem/#principles-of-file-system-organization-for-bem-projects) [schemes](https://en.bem.info/faq/#why-create-separate-directories-and-files-for-every-block-and-technology).

## Usage

```js
const BemFile = require('@bem/sdk.file');

const file = new BemFile({
    cell: {
        block: 'b1',
        elem: 'e1',
        mod: {name: 'm1', val: 'v1'},
        tech: 'js',
        layer: 'desktop'
    },
    level: 'node_modules/bem-core'
});

const stringify = require('@bem/sdk.naming.file.stringify')(require('@bem/sdk.naming.presets/origin'));

stringify(file); // node_modules/bem-core/desktop.blocks/b1/__e1/_m1/b1__e1_m1_v1.js
```

License
-------

Code and documentation © 2017 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
