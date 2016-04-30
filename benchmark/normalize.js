'use strict';

const normalize = require('../lib/index').normalize;
const decls = {
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

suite('normalize', () => {
    set('interations', 200000);

    bench('blocks', () => {
        normalize(decls.blocks);
    });

    bench('block mods', () => {
        normalize(decls.blockMods);
    });

    bench('elems', () => {
        normalize(decls.elems);
    });

    bench('elem mods', () => {
        normalize(decls.elemMods);
    });

    bench('full', () => {
        normalize(decls.full);
    });
});
