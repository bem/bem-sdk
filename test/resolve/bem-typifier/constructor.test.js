'use strict';

const test = require('ava');

const BemTypifier = require('../../../lib/resolve/bem-typifier');

test('should return empty array with blocks', t => {
    const typifier = new BemTypifier();

    t.deepEqual(Array.from(typifier.blocks()), []);
});

test('should return empty array with modificators of blocks', t => {
    const typifier = new BemTypifier();

    t.deepEqual(Array.from(typifier.blockModificators()), []);
});

test('should return empty array with elements', t => {
    const typifier = new BemTypifier();

    t.deepEqual(Array.from(typifier.elements()), []);
});

test('should return empty array with modificators of elements', t => {
    const typifier = new BemTypifier();

    t.deepEqual(Array.from(typifier.elementModificators()), []);
});
