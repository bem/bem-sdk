var test = require('ava'),
    normalize = require('../../lib/normalize-harmony');

test('should support strings', function (t) {
    var decl = {
        block: 'block',
        elems: ['elem-1', 'elem-2']
    };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', elem: 'elem-1' },
        { block: 'block',  elem: 'elem-2' }
    ]);
});

test('should support objects', function (t) {
    var decl = {
        block: 'block',
        elems: [{ elem: 'elem' }]
    };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', elem: 'elem' }
    ]);
});

test('should support mods for elem objects', function (t) {
    var decl = {
        block: 'block',
        elems: [{ elem: 'elem', mods: { mod: 'val' } }]
    };

    t.deepEqual(normalize(decl), [
        { block: 'block' },
        { block: 'block', elem: 'elem' },
        { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
    ]);
});
