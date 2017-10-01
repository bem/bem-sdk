'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../lib').BemGraph;

// TODO: make it non-uebansky
//
describe('ignore-tech-deps/common-deps', () => {
    it('should ignore unordered tech dependency on entity', () => {
        const graph = new BemGraph();

        graph.vertex({ block: 'A' }, 'css')
            .linkWith({ block: 'B' });

        const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

        expect(decl).to.not.deep.contain({ entity: { block: 'B' } });
    });

    it('should ignore unordered tech dependency on same tech', () => {
        const graph = new BemGraph();

        graph.vertex({ block: 'A' }, 'js')
            .linkWith({ block: 'B' }, 'js');

        const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

        expect(decl).to.not.deep.contain({ entity: { block: 'B' } });
    });

    it('should ignore unordered tech dependency on another tech', () => {
        const graph = new BemGraph();

        graph.vertex({ block: 'A' }, 'js')
            .linkWith({ block: 'B' }, 'css');

        const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

        expect(decl).to.not.deep.contain({ entity: { block: 'A' }, tech: 'js' });
    });

    it('should ignore tech deps when resolving common deps in same way for ordered and unordered deps', () => {
        const unorderedGraph = new BemGraph();
        const orderedGraph = new BemGraph();

        unorderedGraph
            .vertex({ block: 'A' }, 'css')
            .linkWith({ block: 'B' });

        orderedGraph
            .vertex({ block: 'A' }, 'css')
            .dependsOn({ block: 'B' });

        const declUnordered = Array.from(unorderedGraph.dependenciesOf({ block: 'A' }));
        const declOrdered = Array.from(orderedGraph.dependenciesOf({ block: 'A' }));

        expect(declOrdered).to.be.deep.equal(declUnordered);
    });
});
