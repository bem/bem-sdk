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
    const decl = depsOfGraph('a => b -> c -> d => a', {block: 'a'});

    const indexA = decl.indexOf('a');
    const indexB = decl.indexOf('b');
    const indexD = decl.indexOf('d');

    t.true(indexB < indexA);
    t.true(indexA < indexD);
});

test('should create and resolve another cyclic graph', t => {
    t.deepEqual(depsOfGraph('a -> a__e => a => b, a => c', {block: 'a__e'}), ['b', 'c', 'a', 'a__e']);
});
