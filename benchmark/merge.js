var merge = require('../lib/index').merge,
    decls = {
        blocks: [
            [{ block: 'block-1' }],
            [{ block: 'block-2' }]
        ],
        blockMods: [
            [{ block: 'block', modName: 'bool-mod', modVal: true }],
            [{ block: 'block', modName: 'mod', modVal: 'val-1' }],
            [{ block: 'block', modName: 'mod', modVal: 'val-2' }]
        ],
        elems: [
            [{ block: 'block', elem: 'elem-1' }],
            [{ block: 'block', elem: 'elem-2' }]
        ],
        elemMods: [
            [{ block: 'block', elem: 'elem' , modName: 'bool-mod', modVal: true }],
            [{ block: 'block', elem: 'elem' , modName: 'mod', modVal: 'val-1' }],
            [{ block: 'block', elem: 'elem' , modName: 'mod', modVal: 'val-2' }]
        ]
    };
    decls.full = [].concat(decls.blocks, decls.blockMods, decls.elems, decls.elemMods);

suite('merge', function () {
    set('interations', 200000);

    bench('blocks', function () {
        merge.apply(null, decls.blocks);
    });

    bench('block mods', function () {
        merge.apply(null, decls.blockMods);
    });

    bench('elems', function () {
        merge.apply(null, decls.elems);
    });

    bench('elem mods', function () {
        merge.apply(null, decls.elemMods);
    });

    bench('full', function () {
        merge.apply(null, decls.full);
    });
});
