'use strict';

const test = require('ava');

const BemGraph = lib.BemGraph;
const findIndex = utils.findIndex;

test('should prioritise ordered dependency over decl recommended ordering', t => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' })
        .dependsOn({ block: 'B' });

    const decl = graph.dependenciesOf([{ block: 'A' }, { block: 'B' }]);
    const indexA = findIndex(decl, { entity: { block: 'A' } });
    const indexB = findIndex(decl, { entity: { block: 'B' } });

    t.true(indexB < indexA);
});

test('should prioritise ordered dependency over deps recommended ordering', t => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' })
        .linkWith({ block: 'B' })
        .dependsOn({ block: 'C' });

    const decl = graph.dependenciesOf({ block: 'A' });
    const indexB = findIndex(decl, { entity: { block: 'B' } });
    const indexC = findIndex(decl, { entity: { block: 'C' } });

    t.true(indexC < indexB);
});

// TODO: NADO STREMITSYA CHTOBY DECLARATSIA BYLA POVYSHE
test.failing('should resolve ordered dependencies independently of unordered dependency of declaration entity', t => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' })
        .linkWith({ block: 'B' })
        .linkWith({ block: 'C' });

    graph
        .vertex({ block: 'C' })
        .dependsOn({ block: 'D' });

    const decl = graph.dependenciesOf({ block: 'A' });

    t.deepEqual(decl, [
        { entity: { block: 'A' } },
        { entity: { block: 'B' } },

        { entity: { block: 'D' } },
        { entity: { block: 'C' } }
    ]);
});
