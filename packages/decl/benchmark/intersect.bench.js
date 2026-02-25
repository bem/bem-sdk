import { performance } from 'node:perf_hooks';

import { intersect } from '../lib/index.js';

function bench(name, fn, iterations = 200000) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) {
        fn();
    }
    const elapsed = performance.now() - start;
    console.log(`  ${name}: ${iterations} iterations in ${elapsed.toFixed(2)}ms (${(iterations / elapsed * 1000).toFixed(0)} ops/sec)`);
}

console.log('subtract (intersect):');

bench('blocks', () => {
    const decl1 = [{ block: 'block-1' }, { block: 'block-2' }, { block: 'block-3' }];
    const decl2 = [{ block: 'block-2' }];

    intersect(decl1, decl2);
});
