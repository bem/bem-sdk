# bem-scheme

BEM file system schemes.

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

require('bem-scheme')('nested').path(entity, tech, options); // b1/__e1/_m1/b1__e1_m1_v1.js
```
