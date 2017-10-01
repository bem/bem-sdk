'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../lib').BemGraph;
const findIndex = require('../../lib/test-utils').findIndex;

describe('deps-recommended-order/ordered-deps', () => {
    it('should keep the ordering described in deps', () => {
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

    it('should keep ordering for transitive dependencies', () => {
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

    it('should keep deps ordering if dependencies are unaffected by other ordering', () => {
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

    it('should keep deps ordering if dependencies are unaffected by explicit ordering', () => {
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
});
