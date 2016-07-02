'use strict';

const test = require('ava');

const BemGraph = lib.BemGraph;

test('should throw error if detected ordered loop between same techs', t => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' }, 'css')
        .dependsOn({ block: 'B' }, 'css');

    graph
        .vertex({ block: 'B' }, 'css')
        .dependsOn({ block: 'A' }, 'css');

    t.plan(1);

    try {
        graph.dependenciesOf({ block: 'A' }, 'css');
    } catch (error) {
        t.deepEqual(error.loop, [
            { entity: { block: 'A' }/*, tech: 'css'*/ },
            { entity: { block: 'B' }, tech: 'css' },
            { entity: { block: 'A' }, tech: 'css' }
        ]);
    }
});

test('should not throw error if detected loop between different techs', t => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' }, 'js')
        .dependsOn({ block: 'B' }, 'bemhtml');

    graph
        .vertex({ block: 'B' }, 'js')
        .dependsOn({ block: 'A' }, 'bemhtml');

    t.notThrows(() => graph.dependenciesOf({ block: 'A' }, 'js'));
});

test('should throw error if detected loop between common and specific techs', t => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' })
        .dependsOn({ block: 'B' });

    graph
        .vertex({ block: 'B' })
        .dependsOn({ block: 'A' }, 'css');

    t.plan(1);

    try {
        graph.dependenciesOf({ block: 'A' });
    } catch (error) {
        t.deepEqual(error.loop, [
            { entity: { block: 'A' } },
            { entity: { block: 'B' } },
            { entity: { block: 'A' }, tech: 'css' }
        ]);
    }
});

test('should throw error if detected loop between common and other techs', t => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' })
        .dependsOn({ block: 'B' });

    graph
        .vertex({ block: 'B' })
        .dependsOn({ block: 'A' }, 'css');

    t.plan(1);

    try {
        graph.dependenciesOf({ block: 'A' }, 'css');
    } catch (error) {
        t.deepEqual(error.loop, [
            { entity: { block: 'A' } },
            { entity: { block: 'B' } },
            { entity: { block: 'A' }, tech: 'css' }
        ]);
    }
});

test('should not throw error if detected loop on itself with other tech', t => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' }, 'css')
        .dependsOn({ block: 'A' }, 'js');

    graph
        .vertex({ block: 'A' })
        .linkWith({ block: 'A' }, 'css');

    t.notThrows(() => graph.dependenciesOf({ block: 'A' }, 'css'));
});
