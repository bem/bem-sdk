'use strict';

const test = require('ava');

const BemGraph = lib.BemGraph;

test('should not throw error if detected unordered loop on itself', t => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' })
        .linkWith({ block: 'A' });

    t.notThrows(() => graph.dependenciesOf({ block: 'A' }));
});

test('should not throw error if detected ordered loop on itself', t => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' })
        .dependsOn({ block: 'A' });

    t.notThrows(() => graph.dependenciesOf({ block: 'A' }));
});
