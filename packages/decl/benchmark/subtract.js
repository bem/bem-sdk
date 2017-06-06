'use strict';

const subtract = require('../lib/index').subtract;

suite('subtract', () => {
    set('interations', 200000);

    bench('blocks', () => {
        var decl1 = [{ block: 'block-1' }, { block: 'block-2' }, { block: 'block-3' }],
            decl2 = [{ block: 'block-2' }];

        subtract(decl1, decl2);
    });
});
