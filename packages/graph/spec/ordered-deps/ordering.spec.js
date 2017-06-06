'use strict';

const test = require('ava');
const expect = require('chai').expect;

const BemGraph = lib.BemGraph;
const findIndex = utils.findIndex;

test('should place ordered entity from decl before entity depending on it', () => {
    const graph = new BemGraph();

    const decl = [
        { block: 'A' },
        { block: 'B' }
    ];

    graph.vertex({ block: 'A' })
        .dependsOn({ block: 'B' });

    const resolved = Array.from(graph.dependenciesOf(decl));

    const indexA = findIndex(resolved, { entity: { block: 'A' } });
    const indexB = findIndex(resolved, { entity: { block: 'B' } });

    expect(indexB).to.be.below(indexA);
});

test('should place ordered entity from decl before several entities depending on it', () => {
    const graph = new BemGraph();

    const decl = [
        { block: 'A' },
        { block: 'B' },
        { block: 'C' }
    ];

    graph.vertex({ block: 'A' })
        .dependsOn({ block: 'C' });

    graph.vertex({ block: 'B' })
        .dependsOn({ block: 'C' });

    const resolved = Array.from(graph.dependenciesOf(decl));

    const indexA = findIndex(resolved, { entity: { block: 'A' } });
    const indexB = findIndex(resolved, { entity: { block: 'B' } });
    const indexC = findIndex(resolved, { entity: { block: 'C' } });

    expect(indexC).to.be.below(indexA)
        .and.to.be.below(indexB);
});

test('should place ordered dependency before entity from decl depending on it', () => {
    const graph = new BemGraph();

    graph.vertex({ block: 'A' })
        .dependsOn({ block: 'B' });

    const resolved = Array.from(graph.dependenciesOf({ block: 'A' }));

    const indexA = findIndex(resolved, { entity: { block: 'A' } });
    const indexB = findIndex(resolved, { entity: { block: 'B' } });

    expect(indexB).to.be.below(indexA);
});

test('should place ordered dependency before multiple entities from decl depending on it', () => {
    const graph = new BemGraph();

    const decl = [
        { block: 'A' },
        { block: 'B' }
    ];

    graph.vertex({ block: 'A' })
        .dependsOn({ block: 'C' });

    graph.vertex({ block: 'B' })
        .dependsOn({ block: 'C' });

    const resolved = Array.from(graph.dependenciesOf(decl));

    const indexA = findIndex(resolved, { entity: { block: 'A' } });
    const indexB = findIndex(resolved, { entity: { block: 'B' } });
    const indexC = findIndex(resolved, { entity: { block: 'C' } });

    expect(indexC).to.be.below(indexA)
        .and.to.be.below(indexB);
});

test('should keep decl ordering for entities unaffected by ordered dependency', () => {
    const graph = new BemGraph();

    const decl = [
        { block: 'A' },
        { block: 'B' }
    ];

    graph.vertex({ block: 'A' })
        .dependsOn({ block: 'C' });

    const resolved = Array.from(graph.dependenciesOf(decl));

    const indexA = findIndex(resolved, { entity: { block: 'A' } });
    const indexB = findIndex(resolved, { entity: { block: 'B' } });

    expect(indexA).to.be.below(indexB);
});

test('should place ordered dependency before dependency depending on it', () => {
    const graph = new BemGraph();

    graph.vertex({ block: 'A' })
        .linkWith({ block: 'B' });

    graph.vertex({ block: 'B' })
        .dependsOn({ block: 'C' });

    const resolved = Array.from(graph.dependenciesOf({ block: 'A' }));

    const indexB = findIndex(resolved, { entity: { block: 'B' } });
    const indexC = findIndex(resolved, { entity: { block: 'C' } });

    expect(indexC).to.be.below(indexB);
});

test('should place ordered dependency before several dependencies depending on it', () => {
    const graph = new BemGraph();

    graph.vertex({ block: 'A' })
        .linkWith({ block: 'B' })
        .linkWith({ block: 'C' });

    graph.vertex({ block: 'B' })
        .dependsOn({ block: 'D' });

    graph.vertex({ block: 'C' })
        .dependsOn({ block: 'D' });

    const resolved = Array.from(graph.dependenciesOf({ block: 'A' }));

    const indexB = findIndex(resolved, { entity: { block: 'B' } });
    const indexC = findIndex(resolved, { entity: { block: 'C' } });
    const indexD = findIndex(resolved, { entity: { block: 'D' } });

    expect(indexD).to.be.below(indexB)
        .and.to.be.below(indexC);
});

test('should place ordered dependency before entity from decl and another dependency if they depend on ' +
    'it', () => {
    const graph = new BemGraph();

    graph.vertex({ block: 'A' })
        .linkWith({ block: 'B' })
        .dependsOn({ block: 'C' });

    graph.vertex({ block: 'B' })
        .dependsOn({ block: 'C' });

    const resolved = Array.from(graph.dependenciesOf({ block: 'A' }));

    const indexA = findIndex(resolved, { entity: { block: 'A' } });
    const indexB = findIndex(resolved, { entity: { block: 'B' } });
    const indexC = findIndex(resolved, { entity: { block: 'C' } });

    expect(indexC).to.be.below(indexA)
        .and.to.be.below(indexB);
});
