var test = require('ava'),
    normalize = require('../../lib/normalize');

test('should support objects', function (t) {
    var decl = { name: 'block', mods: [{ name: 'mod', vals: [{ name: 'val' }] }] };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', modName: 'mod', modVal: 'val' }
    ]);
});

test('should support several items', function (t) {
    var decl = { name: 'block', mods: [
        { name: 'mod-1', vals: [{ name: 'val' }] },
        { name: 'mod-2', vals: [{ name: 'val' }] }
    ] };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', modName: 'mod-1', modVal: 'val' },
        { block: 'block', modName: 'mod-2', modVal: 'val' }
    ]);
});

test('should support mod shortcut', function (t) {
    var decl = { name: 'block', mods: [{ name: 'mod' }] };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', modName: 'mod', modVal: true }
    ]);
});
