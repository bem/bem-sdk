# bem-fs-scheme

[BEM file system](https://en.bem.info/method/filesystem/#principles-of-file-system-organization-for-bem-projects) [schemes](https://en.bem.info/faq/#why-create-separate-directories-and-files-for-every-block-and-technology).

## Supported schemes

* nested
* flat

## Usage
```js
var entity = {
    block: 'b1',
    elem: 'e1',
    modName: 'm1',
    modVal: 'v1'
};

var tech = 'js';

var options = {
    naming: {
        elem: '__',
        mod: '-'
    }
}; // this is default value

require('bem-fs-scheme')('nested').path(entity, tech, options); // b1/__e1/_m1/b1__e1_m1_v1.js
```

License
-------

Code and documentation © 2015 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
