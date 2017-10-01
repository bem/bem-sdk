'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../lib').BemGraph;

describe('ordering-priority/ordered-vs-decl', () => {
    it('should resolve ordered dependencies independently for each declaration entity', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .dependsOn({ block: 'C' });

        graph
            .vertex({ block: 'B' })
            .dependsOn({ block: 'D' });

        const decl = graph.dependenciesOf([{ block: 'A' }, { block: 'B' }]);

        expect(decl).to.deep.equal([
            { entity: { block: 'C' } },
            { entity: { block: 'A' } },

            { entity: { block: 'D' } },
            { entity: { block: 'B' } }
        ]);
    });

    it('should resolve ordered dependencies independently of declaration entity', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .linkWith({ block: 'B' });

        graph
            .vertex({ block: 'B' })
            .dependsOn({ block: 'C' });

        const decl = graph.dependenciesOf({ block: 'A' });

        expect(decl).to.deep.equal([
            { entity: { block: 'A' } },

            { entity: { block: 'C' } },
            { entity: { block: 'B' } }
        ]);
    });
});
