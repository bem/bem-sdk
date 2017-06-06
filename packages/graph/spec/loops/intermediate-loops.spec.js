'use strict';

const test = require('ava');

const BemGraph = lib.BemGraph;

test('should not throw error if detected unordered intermediate loop', t => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' })
        .linkWith({ block: 'B' });

    graph
        .vertex({ block: 'B' })
        .linkWith({ block: 'C' });

    graph
        .vertex({ block: 'C' })
        .linkWith({ block: 'B' });

    t.notThrows(() => graph.dependenciesOf({ block: 'A' }));
});

test('should not throw error if detected unordered intermediate loop with ordered part', t => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' })
        .linkWith({ block: 'B' });

    graph
        .vertex({ block: 'B' })
        .linkWith({ block: 'C' });

    graph
        .vertex({ block: 'C' })
        .dependsOn({ block: 'B' });

    t.notThrows(() => graph.dependenciesOf({ block: 'A' }));
});

test('should throw error if detected ordered intermediate loop', t => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' })
        .dependsOn({ block: 'B' });

    graph
        .vertex({ block: 'B' })
        .dependsOn({ block: 'C' });

    graph
        .vertex({ block: 'C' })
        .dependsOn({ block: 'B' });

    t.plan(1);

    try {
        graph.dependenciesOf({ block: 'A' });
    } catch (error) {
        t.deepEqual(error.loop, [
            { entity: { block: 'A' } }, // ?
            { entity: { block: 'B' } },
            { entity: { block: 'C' } },
            { entity: { block: 'B' } }
        ]);
    }
});
