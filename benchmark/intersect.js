var intersect = require('../lib/index').intersect;

suite('subtract', function () {
    set('intersect', 200000);

    bench('blocks', function () {
        var decl1 = [{ block: 'block-1' }, { block: 'block-2' }, { block: 'block-3' }],
            decl2 = [{ block: 'block-2' }];

        intersect(decl1, decl2);
    });
});
