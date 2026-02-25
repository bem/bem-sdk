import { performance } from 'node:perf_hooks';

import { normalize } from '../lib/index.js';

const opts = { harmony: true };
const normalizeHarmony = function (entities) {
    return normalize(entities, opts);
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

function bench(name, fn, iterations = 200000) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        fn();
    }
    const elapsed = performance.now() - start;
    console.log(`  ${name}: ${iterations} iterations in ${elapsed.toFixed(2)}ms (${(iterations / elapsed * 1000).toFixed(0)} ops/sec)`);
}

console.log('normalize --harmony:');

bench('blocks', () => {
    normalizeHarmony(decls.blocks);
});

bench('block mods', () => {
    normalizeHarmony(decls.blockMods);
});

bench('elems', () => {
    normalizeHarmony(decls.elems);
});

bench('elem mods', () => {
    normalizeHarmony(decls.elemMods);
});

bench('full', () => {
    normalizeHarmony(decls.full);
});
