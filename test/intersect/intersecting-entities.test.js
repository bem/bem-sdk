var test = require('ava'),
    intersect = require('../../lib/intersect');

test('should intersect block with block', function (t) {
    var block = [{ block: 'block' }];

    t.deepEqual(intersect(block, block), block);
});

test('should intersect bool mod with bool mod', function (t) {
    var mod = [{ block: 'block', modName: 'mod', modVal: true }];

    t.deepEqual(intersect(mod, mod), mod);
});

test('should intersect mod with mod', function (t) {
    var mod = [{ block: 'block', modName: 'mod', modVal: 'val' }];

    t.deepEqual(intersect(mod, mod), mod);
});

test('should intersect elem with elem', function (t) {
    var elem = [{ block: 'block', elem: 'elem' }];

    t.deepEqual(intersect(elem, elem), elem);
});

test('should intersect bool mod of elem with bool mod of elem', function (t) {
    var mod = [{ block: 'block', elem: 'elem' , modName: 'mod', modVal: true }];

    t.deepEqual(intersect(mod, mod), mod);
});

test('should intersect elem mod with elem mod', function (t) {
    var mod = [{ block: 'block', elem: 'elem' , modName: 'mod', modVal: 'val' }];

    t.deepEqual(intersect(mod, mod), mod);
});
