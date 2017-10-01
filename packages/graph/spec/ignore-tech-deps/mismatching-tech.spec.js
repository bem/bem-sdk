'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../lib').BemGraph;

// TODO: make it non-uebansky

describe('ignore-tech-deps/mismatching-tech', () => {
    it('should ignore entity dependency on mismatched tech', () => {
        const graph = new BemGraph();

        graph.vertex({ block: 'A' }, 'css')
            .linkWith({ block: 'B' });

        const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'js'));

        expect(decl).to.not.deep.contain({ entity: { block: 'B' }, tech: 'js' });
    });

    it('should ignore unordered tech dependency on other and mismatched tech', () => {
        const graph = new BemGraph();

        graph.vertex({ block: 'A' }, 'css')
            .linkWith({ block: 'B' }, 'js');

        const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'js'));

        expect(decl).to.not.deep.contain({ entity: { block: 'B' }, tech: 'js' });
    });

    it('should ignore tech dependency on same and mismatched tech', () => {
        const graph = new BemGraph();

        graph.vertex({ block: 'A' }, 'css')
            .linkWith({ block: 'B' }, 'css')

        const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'js'));

        expect(decl).to.not.include({ entity: { block: 'B' }, tech: 'css' });
    });

    // wtf again, they are empty both
    it('should ignore tech deps for mismatching techs in same way for ordered and unordered deps', () => {
        const unorderedGraph = new BemGraph();
        const orderedGraph = new BemGraph();

        unorderedGraph.vertex({ block: 'A' }, 'css')
            .linkWith({ block: 'B' });

        orderedGraph.vertex({ block: 'A' }, 'css')
            .dependsOn({ block: 'B' });

        const resolvedUnordered = Array.from(unorderedGraph.dependenciesOf({ block: 'A' }, 'js'));
        const resolvedOrdered = Array.from(orderedGraph.dependenciesOf({ block: 'A' }, 'js'));

        expect(resolvedOrdered).to.be.deep.equal(resolvedUnordered);
    });
});
