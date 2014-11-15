bem-walk
========

Usages
------

```js
var walk = require('bem-walk');
var walker = walk(['common.blocks', 'desktop.blocks']);

walker.on('data', function (data) {
    // data is bem-object
});
```
