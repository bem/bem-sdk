'use strict';

var naming = require('../index'),
    notations = {
        block: { block: 'block' },
        blockMod: { block: 'block', mod: { name: 'mod-name', val: 'mod-val' } },
        elem: { block: 'block', elem: 'elem' },
        elemMod: { block: 'block', elem: 'elem', mod: { name: 'mod-name', val: 'mod-val' } }
    };

suite('stringify', function () {
    set('iterations', 2000000);

    bench('block', function () {
        naming.stringify(notations.block);
    });

    bench('blockMod', function () {
        naming.stringify(notations.blockMod);
    });

    bench('elem', function () {
        naming.stringify(notations.elem);
    });

    bench('elemMod', function () {
        naming.stringify(notations.elemMod);
    });
});
