var subtract = require('../lib/index').subtract;

suite('subtract', function () {
    set('interations', 200000);

    bench('blocks', function () {
        var decl1 = [{ block: 'block-1' }, { block: 'block-2' }, { block: 'block-3' }],
            decl2 = [{ block: 'block-2' }];

        subtract(decl1, decl2);
    });
});
