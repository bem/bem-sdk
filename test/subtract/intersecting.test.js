'use strict';

const test = require('ava');
const subtract = require('../../lib/subtract');

test('should subtract block from block', t => {
    const block = [{ block: 'block' }];

    t.deepEqual(subtract(block, block), []);
});

test('should subtract bool mod from bool mod', t => {
    const mod = [{ block: 'block', modName: 'mod', modVal: true }];

    t.deepEqual(subtract(mod, mod), []);
});

test('should subtract mod from mod', t => {
    const mod = [{ block: 'block', modName: 'mod', modVal: 'val' }];

    t.deepEqual(subtract(mod, mod), []);
});

test('should subtract elem from elem', t => {
    const elem = [{ block: 'block', elem: 'elem' }];

    t.deepEqual(subtract(elem, elem), []);
});

test('should subtract bool mod of elem from bool mod of elem', t => {
    const mod = [{ block: 'block', elem: 'elem' , modName: 'mod', modVal: true }];

    t.deepEqual(subtract(mod, mod), []);
});

test('should subtract elem mod from elem mod', t => {
    const mod = [{ block: 'block', elem: 'elem' , modName: 'mod', modVal: 'val' }];

    t.deepEqual(subtract(mod, mod), []);
});
