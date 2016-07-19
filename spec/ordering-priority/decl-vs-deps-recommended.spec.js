'use strict';

const test = require('ava');

const BemGraph = lib.BemGraph;
const findIndex = utils.findIndex;

test.only('should prioritise decl order over recommended deps order', t => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' })
        .linkWith({ block: 'B' })
        .linkWith({ block: 'C' });

    const decl = Array.from(graph.dependenciesOf([{ block: 'A' }, { block: 'C' }, { block: 'B' }]));

    const indexB = findIndex(decl, { entity: { block: 'B' } });
    const indexC = findIndex(decl, { entity: { block: 'C' } });

    t.true(indexC < indexB);
});

test('should save user order for unordered dependencies', t => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' })
        .linkWith({ block: 'B' })
        .linkWith({ block: 'C' });

    const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

    const indexB = findIndex(decl, { entity: { block: 'B' } });
    const indexC = findIndex(decl, { entity: { block: 'C' } });

    t.true(indexB < indexC);
});

test('should save decl order when resolve ordered and unordered deps of another dependency', t => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' })
        .dependsOn({ block: 'C' })
        .linkWith({ block: 'D' });

    const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

    const indexC = findIndex(decl, { entity: { block: 'C' } });
    const indexD = findIndex(decl, { entity: { block: 'D' } });

    t.true(indexC < indexD);
});
