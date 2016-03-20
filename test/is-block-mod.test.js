'use strict';

const test = require('ava');
const naming = require('../index');

test('should detect mod of block', t => {
    const entity = { block: 'block', modName: 'mod', modVal: 'val' };

    t.true(naming.isBlockMod(entity));
});

test('should detect boolean mod of block by strict object', t => {
    const entity = { block: 'block', modName: 'mod', modVal: true };

    t.true(naming.isBlockMod(entity));
});

test('should detect boolean mod of block by object without `modVal` field', t => {
    const entity = { block: 'block', modName: 'mod' };

    t.true(naming.isBlockMod(entity));
});
