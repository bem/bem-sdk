var test = require('ava'),
    intersect = require('../../lib/intersect');

test('should not intersect other entities from block', function (t) {
    var decl1 = [{ block: 'block' }],
        decl2 = [
            { block: 'block', modName: 'mod', modVal: true },
            { block: 'block', modName: 'mod', modVal: 'val' },
            { block: 'block', elem: 'elem' },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
        ];

    t.deepEqual(intersect(decl1, decl2), []);
});

test('should not intersect other entities from bool mod', function (t) {
    var decl1 = [{ block: 'block', modName: 'mod', modVal: true }],
        decl2 = [
            { block: 'block' },
            { block: 'block', modName: 'mod', modVal: 'val' },
            { block: 'block', elem: 'elem' },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
        ];

    t.deepEqual(intersect(decl1, decl2), []);
});

test('should not intersect other entities from mod', function (t) {
    var decl1 = [{ block: 'block', modName: 'mod', modVal: 'val' }],
        decl2 = [
            { block: 'block' },
            { block: 'block', modName: 'mod', modVal: true },
            { block: 'block', elem: 'elem' },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
        ];

    t.deepEqual(intersect(decl1, decl2), []);
});

test('should not intersect other entities from elem', function (t) {
    var decl1 = [{ block: 'block', elem: 'elem' }],
        decl2 = [
            { block: 'block' },
            { block: 'block', modName: 'mod', modVal: true },
            { block: 'block', modName: 'mod', modVal: 'val' },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
        ];

    t.deepEqual(intersect(decl1, decl2), []);
});

test('should not intersect other entities from bool mod of elem', function (t) {
    var decl1 = [{ block: 'block', elem: 'elem',  modName: 'mod', modVal: true }],
        decl2 = [
            { block: 'block' },
            { block: 'block', modName: 'mod', modVal: true },
            { block: 'block', modName: 'mod', modVal: 'val' },
            { block: 'block', elem: 'elem' },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
        ];

    t.deepEqual(intersect(decl1, decl2), []);
});

test('should not intersect other entities from mod of elem', function (t) {
    var decl1 = [{ block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }],
        decl2 = [
            { block: 'block' },
            { block: 'block', modName: 'mod', modVal: true },
            { block: 'block', modName: 'mod', modVal: 'val' },
            { block: 'block', elem: 'elem' },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: true }
        ];

    t.deepEqual(intersect(decl1, decl2), []);
});
