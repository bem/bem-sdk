'use strict';

const test = require('ava');
const expect = require('chai').expect;

const BemGraph = lib.BemGraph;
const findIndex = utils.findIndex;

test('should keep the ordering described in deps', () => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' })
        .dependsOn({ block: 'B' })
        .dependsOn({ block: 'C' });

    const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

    const indexB = findIndex(decl, { entity: { block: 'B' } });
    const indexC = findIndex(decl, { entity: { block: 'C' } });

    expect(indexB).to.be.below(indexC);
});

test('should keep ordering for transitive dependencies', () => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' })
        .dependsOn({ block: 'B' });

    graph
        .vertex({ block: 'B' })
        .dependsOn({ block: 'C' })
        .dependsOn({ block: 'D' });

    const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

    const indexC = findIndex(decl, { entity: { block: 'C' } });
    const indexD = findIndex(decl, { entity: { block: 'D' } });

    expect(indexC).to.be.below(indexD);
});

test('should keep deps ordering if dependencies are unaffected by other ordering', () => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' })
        .linkWith({ block: 'B' })
        .linkWith({ block: 'C' });

    graph
        .vertex({ block: 'B' })
        .dependsOn({ block: 'D' });

    graph
        .vertex({ block: 'C' })
        .dependsOn({ block: 'D' });

    const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

    const indexB = findIndex(decl, { entity: { block: 'B' } });
    const indexC = findIndex(decl, { entity: { block: 'C' } });

    expect(indexB).to.be.below(indexC);
});

test('should keep deps ordering if dependencies are unaffected by explicit ordering', () => {
    const graph = new BemGraph();

    graph
        .vertex({ block: 'A' })
        .linkWith({ block: 'B' })
        .linkWith({ block: 'C' })
        .linkWith({ block: 'D' });

    graph
        .vertex({ block: 'B' })
        .dependsOn({ block: 'C' });

    const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

    const indexB = findIndex(decl, { entity: { block: 'B' } });
    const indexD = findIndex(decl, { entity: { block: 'D' } });

    expect(indexB).to.be.below(indexD);
});
