'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;


const BemGraph = require('../../lib').BemGraph;
const findIndex = require('../../lib/test-utils').findIndex;

describe('ordering-priority/decl-vs-deps-recommended', () => {
    it('should prioritise decl order over recommended deps order', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .linkWith({ block: 'B' })
            .linkWith({ block: 'C' });

        const decl = Array.from(graph.dependenciesOf([{ block: 'A' }, { block: 'C' }, { block: 'B' }]));

        const indexB = findIndex(decl, { entity: { block: 'B' } });
        const indexC = findIndex(decl, { entity: { block: 'C' } });

        expect(indexC < indexB).to.be.true;
    });

    it('should save user order for unordered dependencies', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .linkWith({ block: 'B' })
            .linkWith({ block: 'C' });

        const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

        const indexB = findIndex(decl, { entity: { block: 'B' } });
        const indexC = findIndex(decl, { entity: { block: 'C' } });

        expect(indexB < indexC).to.be.true;
    });

    it('should save decl order when resolve ordered and unordered deps of another dependency', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .dependsOn({ block: 'C' })
            .linkWith({ block: 'D' });

        const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

        const indexC = findIndex(decl, { entity: { block: 'C' } });
        const indexD = findIndex(decl, { entity: { block: 'D' } });

        expect(indexC < indexD).to.be.true;
    });
});
