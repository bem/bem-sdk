'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../lib').BemGraph;

describe('loops/itself-loops', () => {
    it('should not throw error if detected unordered loop on itself', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .linkWith({ block: 'A' });

        expect(() => graph.dependenciesOf({ block: 'A' })).to.not.throw();
    });

    it('should not throw error if detected ordered loop on itself', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .dependsOn({ block: 'A' });

        expect(() => graph.dependenciesOf({ block: 'A' })).to.not.throw();
    });
});
