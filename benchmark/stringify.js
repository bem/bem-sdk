var naming = require('../index'),
    notations = {
        block: { block: 'block' },
        blockMod: { block: 'block', modName: 'mod-name', modVal: 'mod-val' },
        elem: { block: 'block', elem: 'elem' },
        elemMod: { block: 'block', elem: 'elem', modName: 'mod-name', modVal: 'mod-val' }
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
