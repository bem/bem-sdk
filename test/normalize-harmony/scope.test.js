var test = require('ava'),
    normalize = require('../../lib/normalize-harmony');

test('should support mod in block scope', function (t) {
    var decl = {
        scope: 'block',
        modName: 'mod',
        modVal: 'val'
    };

    t.deepEqual(normalize(decl), [
        { block: 'block', modName: 'mod', modVal: 'val' }
    ]);
});

test('should support mods in block scope', function (t) {
    var decl = {
        scope: 'block',
        mods: { mod: 'val' }
    };

    t.deepEqual(normalize(decl), [
        { block: 'block', modName: 'mod', modVal: 'val' }
    ]);
});

test('should support elem in block scope', function (t) {
    var decl = {
        scope: 'block',
        elem: 'elem'
    };

    t.deepEqual(normalize(decl), [
        { block: 'block', elem: 'elem' }
    ]);
});

test('should support elems in block scope', function (t) {
    var decl = {
        scope: 'block',
        elems: ['elem-1', 'elem-2']
    };

    t.deepEqual(normalize(decl), [
        { block: 'block', elem: 'elem-1' },
        { block: 'block', elem: 'elem-2' }
    ]);
});

test('should support elem mod in block scope', function (t) {
    var decl = {
        scope: 'block',
        elem: 'elem', modName: 'mod', modVal: 'val'
    };

    t.deepEqual(normalize(decl), [
        { block: 'block', elem: 'elem' },
        { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
    ]);
});

test('should support mod in elem scope', function (t) {
    var decl = {
        scope: { block: 'block', elem: 'elem' },
        modName: 'mod', modVal: 'val'
    };

    t.deepEqual(normalize(decl), [
        { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
    ]);
});

test('should support mix in elem scope', function (t) {
    var decl = {
        scope: 'block',
        elems: ['elem-1', 'elem-2'],
        mods: ['mod-1', 'mod-2']
    };

    t.deepEqual(normalize(decl), [
        { block: 'block', elem: 'elem-1' },
        { block: 'block', elem: 'elem-2' },
        { block: 'block', modName: 'mod-1', modVal: true },
        { block: 'block', modName: 'mod-2', modVal: true }
    ]);
});
