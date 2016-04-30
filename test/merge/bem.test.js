var test = require('ava'),
    merge = require('../../lib/merge');

test('should merge block with its elem', function (t) {
    var block = { block: 'block' },
        elem = { block: 'block', elem: 'elem' };

    t.deepEqual(merge([block], [elem]), [block, elem]);
});

test('should merge block with its mod', function (t) {
    var block = { block: 'block' },
        mod = { block: 'block', modName: 'mod', modVal: 'val' };

    t.deepEqual(merge([block], [mod]), [block, mod]);
});

test('should merge block with its bool mod', function (t) {
    var block = { block: 'block' },
        mod = { block: 'block', modName: 'mod', modVal: true };

    t.deepEqual(merge([block], [mod]), [block, mod]);
});

test('should merge elems of block', function (t) {
    var elem1 = { block: 'block', elem: 'elem-1' },
        elem2 = { block: 'block', elem: 'elem-2' };

    t.deepEqual(merge([elem1], [elem2]), [elem1, elem2]);
});

test('should merge mods of block', function (t) {
    var mod1 = { block: 'block', modName: 'mod-1', modVal: true },
        mod2 = { block: 'block', modName: 'mod-2', modVal: true };

    t.deepEqual(merge([mod1], [mod2]), [mod1, mod2]);
});

test('should merge mod vals of block mod', function (t) {
    var val1 = { block: 'block', modName: 'mod', modVal: 'val-1' },
        val2 = { block: 'block', modName: 'mod', modVal: 'val-2' };

    t.deepEqual(merge([val1], [val2]), [val1, val2]);
});

test('should merge elem with its mod', function (t) {
    var elem = { block: 'block', elem: 'elem' },
        mod = { block: 'block', elem: 'elem' , modName: 'mod', modVal: 'val' };

    t.deepEqual(merge([elem], [mod]), [elem, mod]);
});

test('should merge elem with its bool mod', function (t) {
    var elem = { block: 'block', elem: 'elem' },
        mod = { block: 'block', elem: 'elem' , modName: 'mod', modVal: true };

    t.deepEqual(merge([elem], [mod]), [elem, mod]);
});

test('should merge mods of elem', function (t) {
    var mod1 = { block: 'block', elem: 'elem', modName: 'mod-1', modVal: true },
        mod2 = { block: 'block', elem: 'elem', modName: 'mod-2', modVal: true };

    t.deepEqual(merge([mod1], [mod2]), [mod1, mod2]);
});

test('should merge mod vals of elem mod', function (t) {
    var val1 = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-1' },
        val2 = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val-2' };

    t.deepEqual(merge([val1], [val2]), [val1, val2]);
});
