import { performance } from 'node:perf_hooks';

import { merge } from '../lib/index.js';

const decls = {
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

function bench(name, fn, iterations = 200000) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        fn();
    }
    const elapsed = performance.now() - start;
    console.log(`  ${name}: ${iterations} iterations in ${elapsed.toFixed(2)}ms (${(iterations / elapsed * 1000).toFixed(0)} ops/sec)`);
}

console.log('merge:');

bench('blocks', () => {
    merge.apply(null, decls.blocks);
});

bench('block mods', () => {
    merge.apply(null, decls.blockMods);
});

bench('elems', () => {
    merge.apply(null, decls.elems);
});

bench('elem mods', () => {
    merge.apply(null, decls.elemMods);
});

bench('full', () => {
    merge.apply(null, decls.full);
});
