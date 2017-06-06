'use strict';

const test = require('ava');

const BemGraph = lib.BemGraph;
const findIndex = utils.findIndex;

test('should place ordered entity from decl before several entities depending on it', t => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' })
        .dependsOn({ block: 'C' });

    graph
        .vertex({ block: 'B' })
        .dependsOn({ block: 'C' });

    const decl = graph.dependenciesOf([{ block: 'A' }, { block: 'B' }]);

    const indexA = findIndex(decl, { entity: { block: 'A' } });
    const indexB = findIndex(decl, { entity: { block: 'B' } });

    t.true(indexA < indexB);
});

test('should keep decl ordering for entities unaffected by ordering', t => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'B' })
        .dependsOn({ block: 'A' });

    const decl = graph.dependenciesOf([{ block: 'B' }, { block: 'C' }]);

    const indexB = findIndex(decl, { entity: { block: 'B' } });
    const indexC = findIndex(decl, { entity: { block: 'C' } });

    t.true(indexB < indexC);
});
