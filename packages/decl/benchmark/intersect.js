'use strict';

const intersect = require('../lib/index').intersect;

suite('subtract', () => {
    set('intersect', 200000);

    bench('blocks', () => {
        const decl1 = [{ block: 'block-1' }, { block: 'block-2' }, { block: 'block-3' }];
        const decl2 = [{ block: 'block-2' }];

        intersect(decl1, decl2);
    });
});
