'use strict';

const test = require('ava');

const BemEntityName = require('bem-entity-name');

const Vertex = require('../lib/vertex');
const VertexSet = require('../lib/vertex-set');

test('should add different vertices', t => {
    const set = new VertexSet();
    const vertex1 = new Vertex(new BemEntityName({ block: 'input' }));
    const vertex2 = new Vertex(new BemEntityName({ block: 'button' }));

    set.add(vertex1).add(vertex2);

    t.is(set.size, 2);
});

test('should not add equal vertex', t => {
    const set = new VertexSet();
    const entity = new BemEntityName({ block: 'input' });
    const vertex1 = new Vertex(entity);
    const vertex2 = new Vertex(entity);

    set.add(vertex1).add(vertex2);

    t.is(set.size, 1);
});
