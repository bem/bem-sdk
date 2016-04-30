'use strict';

const bemdecl = require('../lib/index');
const opts = { harmony: true };
const normalize = function (entities) {
    return bemdecl.normalize(entities, opts);
};
const decls = {
    blocks: [
        { block: 'block-1' },
        { block: 'block-2' },
        { block: 'block-3' }
    ],
    blockMods: [
        { block: 'block-1', modName: 'mod' },
        { block: 'block-2', modName: 'mod', modVal: true },
        { block: 'block-3', modName: 'mod', modVal: 'val' },
        { block: 'block-4', mods: { mod: 'val' } },
        { block: 'block-5', mods: ['mod-1', 'mod-2'] },
        { block: 'block-6', mods: { mod: ['val-1', 'val-2'] } }
    ],
    elems: [
        { block: 'block', elem: 'elem' },
        { block: 'block', elems: ['elem-1', 'elem-2'] }
    ],
    elemMods: [
        { block: 'block-1', elem: 'elem', modName: 'mod' },
        { block: 'block-2', elem: 'elem', modName: 'mod', modVal: true },
        { block: 'block-3', elem: 'elem', modName: 'mod', modVal: 'val' },
        { block: 'block-4', elem: 'elem', mods: { mod: 'val' } },
        { block: 'block-5', elem: 'elem', mods: ['mod-1', 'mod-2'] },
        { block: 'block-6', elem: 'elem', mods: { mod: ['val-1', 'val-2'] } }
    ]
};

decls.full = [].concat(decls.blocks, decls.blockMods, decls.elems, decls.elemMods);

suite('normalize --harmony', () => {
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
