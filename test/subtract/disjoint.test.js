'use strict';

const test = require('ava');
const subtract = require('../../lib/subtract');

test('should not subtract other entities from block', t => {
    const decl1 = [{ block: 'block' }];
    const decl2 = [
            { block: 'block', modName: 'mod', modVal: true },
            { block: 'block', modName: 'mod', modVal: 'val' },
            { block: 'block', elem: 'elem' },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
        ];

    t.deepEqual(subtract(decl1, decl2), decl1);
});

test('should not subtract other entities from bool mod', t => {
    const decl1 = [{ block: 'block', modName: 'mod', modVal: true }];
    const decl2 = [
            { block: 'block' },
            { block: 'block', modName: 'mod', modVal: 'val' },
            { block: 'block', elem: 'elem' },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
        ];

    t.deepEqual(subtract(decl1, decl2), decl1);
});

test('should not subtract other entities from mod', t => {
    const decl1 = [{ block: 'block', modName: 'mod', modVal: 'val' }];
    const decl2 = [
            { block: 'block' },
            { block: 'block', modName: 'mod', modVal: true },
            { block: 'block', elem: 'elem' },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
        ];

    t.deepEqual(subtract(decl1, decl2), decl1);
});

test('should not subtract other entities from elem', t => {
    const decl1 = [{ block: 'block', elem: 'elem' }];
    const decl2 = [
            { block: 'block' },
            { block: 'block', modName: 'mod', modVal: true },
            { block: 'block', modName: 'mod', modVal: 'val' },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
        ];

    t.deepEqual(subtract(decl1, decl2), decl1);
});

test('should not subtract other entities from bool mod of elem', t => {
    const decl1 = [{ block: 'block', elem: 'elem',  modName: 'mod', modVal: true }];
    const decl2 = [
            { block: 'block' },
            { block: 'block', modName: 'mod', modVal: true },
            { block: 'block', modName: 'mod', modVal: 'val' },
            { block: 'block', elem: 'elem' },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
        ];

    t.deepEqual(subtract(decl1, decl2), decl1);
});

test('should not subtract other entities from mod of elem', t => {
    const decl1 = [{ block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }];
    const decl2 = [
            { block: 'block' },
            { block: 'block', modName: 'mod', modVal: true },
            { block: 'block', modName: 'mod', modVal: 'val' },
            { block: 'block', elem: 'elem' },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: true }
        ];

    t.deepEqual(subtract(decl1, decl2), decl1);
});
