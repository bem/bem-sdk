'use strict';

const test = require('ava');
const naming = require('../lib/bem-naming');

test('should detect mod of elem', t => {
    const entity = { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' };

    t.true(naming.isElemMod(entity));
});

test('should detect boolean mod of elem by strict object', t => {
    const entity = { block: 'block', elem: 'elem', modName: 'mod', modVal: true };

    t.true(naming.isElemMod(entity));
});

test('should detect boolean mod of elem by object without `modVal` field', t => {
    const entity = { block: 'block', elem: 'elem', modName: 'mod' };

    t.true(naming.isElemMod(entity));
});
