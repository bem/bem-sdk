'use strict';

var naming = require('../index'),
    strings = {
        block: 'block',
        blockMod: 'block_mod-name_mod-val',
        elem: 'block__elem',
        elemMod: 'block__elem_mod-name_mod-val'
    };

suite('parse', function () {
    set('iterations', 2000000);

    bench('block', function () {
        naming.parse(strings.block);
    });

    bench('blockMod', function () {
        naming.parse(strings.blockMod);
    });

    bench('elem', function () {
        naming.parse(strings.elem);
    });

    bench('elemMod', function () {
        naming.parse(strings.elemMod);
    });
});
