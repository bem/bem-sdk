'use strict';

const test = require('ava');

const BemEntityName = require('bem-entity-name');
const Vertex = require('../../lib/vertex');

const entity = new BemEntityName({ block: 'button' });
const vertex = new Vertex(entity, 'css');

test('should add `tech` field', t => {
    t.is(vertex.tech, 'css');
});

test('id should include tech', t => {
    t.is(vertex.id, 'button.css');
});
