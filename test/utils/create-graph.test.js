'use strict';

const test = require('ava');

const createGraph = utils.createGraph;
const createVertex = utils.createVertex;

const depsOfGraph = (s, decl, tech) => createGraph(s)
    .dependenciesOf(decl, tech)
    .map(v => createVertex(v.entity, v.tech).id);

test('should create simple graph', t => {
    t.deepEqual(depsOfGraph('a => b', {block: 'a'}), ['b', 'a']);
});

test('should create and resolve cyclic graph', t => {
    t.deepEqual(depsOfGraph('a => b -> c -> d => a', {block: 'a'}), ['b', 'a', 'c', 'd']);
});

test('should create and resolve another cyclic graph', t => {
    t.deepEqual(depsOfGraph('a -> a__e => a => b, a => c', {block: 'a__e'}), ['b', 'c', 'a', 'a__e']);
});
