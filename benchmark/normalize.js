var normalize = require('../lib/index').normalize,
    decls = {
        blocks: [
            { name: 'block-1' },
            { name: 'block-2' },
            { name: 'block-3' }
        ],
        blockMods: [
            { name: 'block-1', mods: [{ name: 'mod', vals: [{ name: 'val' }] }] },
            { name: 'block-2', mods: [{ name: 'mod' }] }
        ],
        elems: [{
            name: 'block',
            elems: [
                { name: 'elem-1' },
                { name: 'elem-2' }
            ]
        }],
        elemMods: [{
            name: 'block',
            elems: [
                { name: 'elem-1', mods: [{ name: 'mod', vals: [{ name: 'val' }] }] },
                { name: 'elem-2', mods: [{ name: 'mod' }] }
            ]
        }]
    };
    decls.full = [].concat(decls.blocks, decls.blockMods, decls.elems, decls.elemMods);

suite('normalize', function () {
    set('interations', 200000);

    bench('blocks', function () {
        normalize(decls.blocks);
    });

    bench('block mods', function () {
        normalize(decls.blockMods);
    });

    bench('elems', function () {
        normalize(decls.elems);
    });

    bench('elem mods', function () {
        normalize(decls.elemMods);
    });

    bench('full', function () {
        normalize(decls.full);
    });
});
