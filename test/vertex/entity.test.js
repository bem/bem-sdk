'use strict';

const test = require('ava');

const BemEntityName = require('bem-entity-name');
const Vertex = require('../../lib/vertex');

const entity = new BemEntityName({ block: 'button' });
const vertex = new Vertex(entity);

test('should add `entity` field', t => {
    t.is(vertex.entity, entity);
});

test('should not add `tech` field', t => {
    t.falsy(vertex.tech);
});

test('id should equal to entity id', t => {
    t.is(vertex.id, entity.id);
});
