'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../lib').BemGraph;
const findIndex = require('../../lib/test-utils').findIndex;

describe('natural-order/deps-recommended-order', () => {
    it('should place block before its element', () => {
        const graph = new BemGraph();

        const decl = [
            { block: 'A', elem: 'e' },
            { block: 'A' }
        ];
        decl.forEach(e => graph.vertex(e));

        graph.naturalize();

        const resolved = Array.from(graph.dependenciesOf(decl));

        const indexBlock = findIndex(resolved, { entity: { block: 'A' } });
        const indexElem = findIndex(resolved, { entity: { block: 'A', elem: 'e' } });

        expect(indexBlock < indexElem).to.be.true;
    });

    it('should place block before its boolean modifier', () => {
        const graph = new BemGraph();

        const decl = [
            { block: 'A', modName: 'm', modVal: true },
            { block: 'A' }
        ];
        decl.forEach(e => graph.vertex(e));

        graph.naturalize();

        const resolved = Array.from(graph.dependenciesOf(decl));

        const indexBlock = findIndex(resolved, { entity: { block: 'A' } });
        const indexModifier = findIndex(resolved, { entity: { block: 'A', modName: 'm' } });

        expect(indexBlock < indexModifier).to.be.true;
    });

    it('should place block before its key-value modifier', () => {
        const graph = new BemGraph();

        const decl = [
            { block: 'A', modName: 'm', modVal: 'any' },
            { block: 'A' }
        ];
        decl.forEach(e => graph.vertex(e));

        graph.naturalize();

        const resolved = Array.from(graph.dependenciesOf(decl));

        const indexBlock = findIndex(resolved, { entity: { block: 'A' } });
        const indexModifier = findIndex(resolved, { entity: { block: 'A', modName: 'm', modVal: 'any' } });

        expect(indexBlock < indexModifier).to.be.true;
    });

    it('should place block before its element with boolean modifier', () => {
        const graph = new BemGraph();

        const decl = [
            { block: 'A', elem: 'e', modName: 'm', modVal: true },
            { block: 'A' }
        ];
        decl.forEach(e => graph.vertex(e));

        graph.naturalize();

        const resolved = Array.from(graph.dependenciesOf(decl));

        const indexBlock = findIndex(resolved, { entity: { block: 'A' } });
        const indexElem = findIndex(resolved, { entity: { block: 'A', elem: 'e', modName: 'm', modVal: true } });

        expect(indexBlock < indexElem).to.be.true;
    });

    it('should place block before its element with key-value modifier', () => {
        const graph = new BemGraph();

        const decl = [
            { block: 'A', elem: 'e', modName: 'm', modVal: 'any' },
            { block: 'A' }
        ];
        decl.forEach(e => graph.vertex(e));

        graph.naturalize();

        const resolved = Array.from(graph.dependenciesOf(decl));

        const indexBlock = findIndex(resolved, { entity: { block: 'A' } });
        const indexElem = findIndex(resolved, { entity: { block: 'A', elem: 'e', modName: 'm', modVal: 'any' } });

        expect(indexBlock < indexElem).to.be.true;
    });

    it('should place block before its boolean modifier', () => {
        const graph = new BemGraph();

        const decl = [
            { block: 'A', modName: 'm', modVal: true },
            { block: 'A' }
        ];
        decl.forEach(e => graph.vertex(e));

        graph.naturalize();

        const resolved = Array.from(graph.dependenciesOf(decl));

        const indexBlock = findIndex(resolved, { entity: { block: 'A' } });
        const indexBoolean = findIndex(resolved, { entity: { block: 'A', modName: 'm', modVal: true } });

        expect(indexBlock < indexBoolean).to.be.true;
    });

    it('should place block\'s boolean modifier before block key-value modifier', () => {
        const graph = new BemGraph();

        const decl = [
            { block: 'A', modName: 'm', modVal: 'any' },
            { block: 'A', modName: 'm', modVal: true }
        ];
        decl.forEach(e => graph.vertex(e));

        graph.naturalize();

        const resolved = Array.from(graph.dependenciesOf(decl));

        const indexBoolean = findIndex(resolved, { entity: { block: 'A', modName: 'n', modVal: true } });
        const indexKeyValue = findIndex(resolved, { entity: { block: 'A', modName: 'm', modVal: 'any' } });

        expect(indexBoolean < indexKeyValue).to.be.true;
    });

    it('should place elem before its boolean modifier', () => {
        const graph = new BemGraph();

        const decl = [
            { block: 'A', elem: 'e', modName: 'm', modVal: true },
            { block: 'A', elem: 'e' }
        ];
        decl.forEach(e => graph.vertex(e));

        graph.naturalize();

        const resolved = Array.from(graph.dependenciesOf(decl));

        const indexElem = findIndex(resolved, { entity: { block: 'A', elem: 'e' } });
        const indexModifier = findIndex(resolved, { entity: { block: 'A', elem: 'e', modName: 'm', modVal: true } });

        expect(indexElem < indexModifier).to.be.true;
    });

    it('should place elem before its key-value modifier', () => {
        const graph = new BemGraph();

        const decl = [
            { block: 'A', elem: 'e', modName: 'm', modVal: 'any' },
            { block: 'A', elem: 'e' }
        ];
        decl.forEach(e => graph.vertex(e));

        graph.naturalize();

        const resolved = Array.from(graph.dependenciesOf(decl));

        const indexElem = findIndex(resolved, { entity: { block: 'A', elem: 'e' } });
        const indexModifier = findIndex(resolved, { entity: { block: 'A', elem: 'e', modName: 'm', modVal: 'any' } });

        expect(indexElem < indexModifier).to.be.true;
    });

    it('should place elem\'s boolean modifier before elem key-value modifier', () => {
        const graph = new BemGraph();

        const decl = [
            { block: 'A', elem: 'e', modName: 'm', modVal: 'any' },
            { block: 'A', elem: 'e', modName: 'm', modVal: true }
        ];
        decl.forEach(e => graph.vertex(e));

        graph.naturalize();

        const resolved = Array.from(graph.dependenciesOf(decl));

        const indexBoolean = findIndex(resolved, { entity: { block: 'A', elem: 'e', modName: 'm', modVal: true } });
        const indexKeyValue = findIndex(resolved, { entity: { block: 'A', elem: 'e', modName: 'm', modVal: 'any' } });

        expect(indexBoolean < indexKeyValue).to.be.true;
    });
});
