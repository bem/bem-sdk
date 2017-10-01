'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;



const BemGraph = require('../../lib').BemGraph;
const findIndex = require('../../lib/test-utils').findIndex;

describe('decl-order/unordered-deps', () => {
    it('should keep the ordering described in decl', () => {
        const graph = new BemGraph();

        const decl = graph.dependenciesOf([{ block: 'A' }, { block: 'B' }]);
        const indexA = findIndex(decl, { entity: { block: 'A' } });
        const indexB = findIndex(decl, { entity: { block: 'B' } });

        expect(indexA < indexB).to.be.true;
    });

    it('should place entities described in decl before their dependencies', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .linkWith({ block: 'B' });

        const decl = graph.dependenciesOf({ block: 'A' });
        const indexA = findIndex(decl, { entity: { block: 'A' } });
        const indexB = findIndex(decl, { entity: { block: 'B' } });

        expect(indexA < indexB).to.be.true;
    });

    it('should not change decl order because of deps order', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'B' })
            .linkWith({ block: 'C' });

        const decl = graph.dependenciesOf([{ block: 'A' }, { block: 'B' }]);
        const indexA = findIndex(decl, { entity: { block: 'A' } });
        const indexB = findIndex(decl, { entity: { block: 'B' } });

        expect(indexA < indexB).to.be.true;
    });
});
