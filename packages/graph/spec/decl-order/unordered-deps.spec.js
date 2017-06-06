'use strict';

const test = require('ava');


const BemGraph = lib.BemGraph;
const findIndex = utils.findIndex;

test('should keep the ordering described in decl', t => {
    const graph = new BemGraph();

    const decl = graph.dependenciesOf([{ block: 'A' }, { block: 'B' }]);
    const indexA = findIndex(decl, { entity: { block: 'A' } });
    const indexB = findIndex(decl, { entity: { block: 'B' } });

    t.true(indexA < indexB);
});

test('should place entities described in decl before their dependencies', t => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' })
        .linkWith({ block: 'B' });

    const decl = graph.dependenciesOf({ block: 'A' });
    const indexA = findIndex(decl, { entity: { block: 'A' } });
    const indexB = findIndex(decl, { entity: { block: 'B' } });

    t.true(indexA < indexB);
});

test('should not change decl order because of deps order', t => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'B' })
        .linkWith({ block: 'C' });

    const decl = graph.dependenciesOf([{ block: 'A' }, { block: 'B' }]);
    const indexA = findIndex(decl, { entity: { block: 'A' } });
    const indexB = findIndex(decl, { entity: { block: 'B' } });

    t.true(indexA < indexB);
});
