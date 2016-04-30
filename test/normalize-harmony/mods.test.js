var test = require('ava'),
    normalize = require('../../lib/normalize-harmony');

test('should support shortcut for bool mod', function (t) {
    var decl = { block: 'block', modName: 'mod' };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', modName: 'mod', modVal: true }
    ]);
});

test('should support bool mod', function (t) {
    var decl = { block: 'block', modName: 'mod', modVal: true };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', modName: 'mod', modVal: true }
    ]);
});

test('should support mod', function (t) {
    var decl = { block: 'block', modName: 'mod', modVal: 'val' };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', modName: 'mod', modVal: 'val' }
    ]);
});

test('should support mods as objects', function (t) {
    var decl = {
        block: 'block',
        mods: { mod: 'val' }
    };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', modName: 'mod', modVal: 'val' }
    ]);
});

test('should support bool mods as array', function (t) {
    var decl = {
        block: 'block',
        mods: ['mod-1', 'mod-2']
    };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', modName: 'mod-1', modVal: true },
        { block: 'block', modName: 'mod-2', modVal: true }
    ]);
});

test('should support mod values as array', function (t) {
    var decl = {
        block: 'block',
        mods: { mod: ['val-1', 'val-2'] }
    };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', modName: 'mod', modVal: 'val-1' },
        { block: 'block', modName: 'mod', modVal: 'val-2' }
    ]);
});
