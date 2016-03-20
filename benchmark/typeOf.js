var naming = require('../index'),
    notations = {
        block: { block: 'block' },
        blockMod: { block: 'block', modName: 'mod-name', modVal: 'mod-val' },
        elem: { block: 'block', elem: 'elem' },
        elemMod: { block: 'block', elem: 'elem', modName: 'mod-name', modVal: 'mod-val' }
    };

suite('typeOf', function () {
    set('iterations', 2000000);

    bench('block', function () {
        naming.typeOf(notations.block);
    });

    bench('blockMod', function () {
        naming.typeOf(notations.blockMod);
    });

    bench('elem', function () {
        naming.typeOf(notations.elem);
    });

    bench('elemMod', function () {
        naming.typeOf(notations.elemMod);
    });
});
