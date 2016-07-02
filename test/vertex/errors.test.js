'use strict';

const test = require('ava');

const Vertex = require('../../lib/vertex');

test('should throw error if BEM entity is not specified', t => {
    t.throws(() => new Vertex());
});

test('should throw error if entity is not BEM entity', t => {
    t.throws(() => new Vertex({ block: 'button' }), 'The `entity` is not `BemEntityName`');
});
