'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;


const BemGraph = require('../../lib').BemGraph;
const findIndex = require('../../lib/test-utils').findIndex;

describe('decl-order/ordered-deps', () => {
    it('should place ordered entity from decl before several entities depending on it', () => {
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

        expect(indexA < indexB).to.be.true;
    });

    it('should keep decl ordering for entities unaffected by ordering', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'B' })
            .dependsOn({ block: 'A' });

        const decl = graph.dependenciesOf([{ block: 'B' }, { block: 'C' }]);

        const indexB = findIndex(decl, { entity: { block: 'B' } });
        const indexC = findIndex(decl, { entity: { block: 'C' } });

        expect(indexB < indexC).to.be.true;
    });
});
