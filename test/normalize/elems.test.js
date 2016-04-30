var test = require('ava'),
    normalize = require('../../lib/normalize');

test('should support arrays', function (t) {
    var decl = {
        name: 'block',
        elems: [
            { name: 'elem-1' },
            { name: 'elem-2' }
        ]
    };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', elem: 'elem-1' },
        { block: 'block', elem: 'elem-2' }
    ]);
});

test('should support objects', function (t) {
    var decl = {
        name: 'block',
        elems: [
            { name: 'elem', mods: [{ name: 'mod', vals: [{ name: 'val' }] }] }
        ]
    };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', elem: 'elem' },
        { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
    ]);
});

test('should support mod shortcut', function (t) {
    var decl = {
        name: 'block',
        elems: [
            { name: 'elem', mods: [{ name: 'mod' }] }
        ]
    };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', elem: 'elem' },
        { block: 'block', elem: 'elem', modName: 'mod', modVal: true }
    ]);
});
