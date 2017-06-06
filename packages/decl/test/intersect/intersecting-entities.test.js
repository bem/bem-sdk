'use strict';

const test = require('ava');
const createCell = require('../util').createCell;
const intersect = require('../../lib/intersect');

test('should intersect block with block', t => {
    const block = [{ entity: { block: 'block' }, tech: null }].map(createCell);

    t.deepEqual(intersect(block, block), block);
});

test('should intersect bool mod with bool mod', t => {
    const mod = [{ entity: { block: 'block', modName: 'mod', modVal: true }, tech: null }].map(createCell);

    t.deepEqual(intersect(mod, mod), mod);
});

test('should intersect mod with mod', t => {
    const mod = [{ entity: { block: 'block', modName: 'mod', modVal: 'val' }, tech: null }].map(createCell);

    t.deepEqual(intersect(mod, mod), mod);
});

test('should intersect elem with elem', t => {
    const elem = [{ entity: { block: 'block', elem: 'elem' }, tech: null }].map(createCell);

    t.deepEqual(intersect(elem, elem), elem);
});

test('should intersect bool mod of elem with bool mod of elem', t => {
    const mod = [
            { entity: { block: 'block', elem: 'elem' , modName: 'mod', modVal: true }, tech: null }
        ].map(createCell);

    t.deepEqual(intersect(mod, mod), mod);
});

test('should intersect elem mod with elem mod', t => {
    const mod = [
            { entity: { block: 'block', elem: 'elem' , modName: 'mod', modVal: 'val' }, tech: null }
        ].map(createCell);

    t.deepEqual(intersect(mod, mod), mod);
});
