var test = require('ava'),
    subtract = require('../../lib/subtract');

test('should subtract block from block', function (t) {
    var block = [{ block: 'block' }];

    t.deepEqual(subtract(block, block), []);
});

test('should subtract bool mod from bool mod', function (t) {
    var mod = [{ block: 'block', modName: 'mod', modVal: true }];

    t.deepEqual(subtract(mod, mod), []);
});

test('should subtract mod from mod', function (t) {
    var mod = [{ block: 'block', modName: 'mod', modVal: 'val' }];

    t.deepEqual(subtract(mod, mod), []);
});

test('should subtract elem from elem', function (t) {
    var elem = [{ block: 'block', elem: 'elem' }];

    t.deepEqual(subtract(elem, elem), []);
});

test('should subtract bool mod of elem from bool mod of elem', function (t) {
    var mod = [{ block: 'block', elem: 'elem' , modName: 'mod', modVal: true }];

    t.deepEqual(subtract(mod, mod), []);
});

test('should subtract elem mod from elem mod', function (t) {
    var mod = [{ block: 'block', elem: 'elem' , modName: 'mod', modVal: 'val' }];

    t.deepEqual(subtract(mod, mod), []);
});
