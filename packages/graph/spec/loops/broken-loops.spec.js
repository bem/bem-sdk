'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;


const BemGraph = require('../../lib').BemGraph;

describe('loops/broken-loops', () => {
    it('should not throw error if detected ordered loop broken in the middle by unordered dependency', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .dependsOn({ block: 'B' });

        graph
            .vertex({ block: 'B' })
            .linkWith({ block: 'C' });

        graph
            .vertex({ block: 'C' })
            .dependsOn({ block: 'A' });

        expect(() => graph.dependenciesOf({ block: 'A' })).to.not.throw();
    });
});
