'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../lib').BemGraph;
const findIndex = require('../../lib/test-utils').findIndex;

describe('ordering-priority/ordered-vs-unordered', () => {
    it('should prioritise ordered dependency over decl recommended ordering', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .dependsOn({ block: 'B' });

        const decl = graph.dependenciesOf([{ block: 'A' }, { block: 'B' }]);
        const indexA = findIndex(decl, { entity: { block: 'A' } });
        const indexB = findIndex(decl, { entity: { block: 'B' } });

        expect(indexB < indexA).to.be.true;
    });

    it('should prioritise ordered dependency over deps recommended ordering', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .linkWith({ block: 'B' })
            .dependsOn({ block: 'C' });

        const decl = graph.dependenciesOf({ block: 'A' });
        const indexB = findIndex(decl, { entity: { block: 'B' } });
        const indexC = findIndex(decl, { entity: { block: 'C' } });

        expect(indexC < indexB).to.be.true;
    });

    // TODO: NADO STREMITSYA CHTOBY DECLARATSIA BYLA POVYSHE
    it.skip('should resolve ordered dependencies independently of unordered dependency of declaration entity', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .linkWith({ block: 'B' })
            .linkWith({ block: 'C' });

        graph
            .vertex({ block: 'C' })
            .dependsOn({ block: 'D' });

        const decl = graph.dependenciesOf({ block: 'A' });

        expect(decl).to.deep.equal([
            { entity: { block: 'A' } },
            { entity: { block: 'B' } },

            { entity: { block: 'D' } },
            { entity: { block: 'C' } }
        ]);
    });
});
