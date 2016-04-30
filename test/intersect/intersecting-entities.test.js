'use strict';

const test = require('ava');
const intersect = require('../../lib/intersect');

test('should intersect block with block', t => {
    const block = [{ block: 'block' }];

    t.deepEqual(intersect(block, block), block);
});

test('should intersect bool mod with bool mod', t => {
    const mod = [{ block: 'block', modName: 'mod', modVal: true }];

    t.deepEqual(intersect(mod, mod), mod);
});

test('should intersect mod with mod', t => {
    const mod = [{ block: 'block', modName: 'mod', modVal: 'val' }];

    t.deepEqual(intersect(mod, mod), mod);
});

test('should intersect elem with elem', t => {
    const elem = [{ block: 'block', elem: 'elem' }];

    t.deepEqual(intersect(elem, elem), elem);
});

test('should intersect bool mod of elem with bool mod of elem', t => {
    const mod = [{ block: 'block', elem: 'elem' , modName: 'mod', modVal: true }];

    t.deepEqual(intersect(mod, mod), mod);
});

test('should intersect elem mod with elem mod', t => {
    const mod = [{ block: 'block', elem: 'elem' , modName: 'mod', modVal: 'val' }];

    t.deepEqual(intersect(mod, mod), mod);
});
