import { performance } from 'node:perf_hooks';

import { normalize } from '../lib/index.js';

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

function bench(name, fn, iterations = 200000) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        fn();
    }
    const elapsed = performance.now() - start;
    console.log(`  ${name}: ${iterations} iterations in ${elapsed.toFixed(2)}ms (${(iterations / elapsed * 1000).toFixed(0)} ops/sec)`);
}

console.log('normalize:');

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
