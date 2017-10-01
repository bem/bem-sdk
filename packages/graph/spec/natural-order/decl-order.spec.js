'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;


const BemGraph = require('../../lib').BemGraph;
const findIndex = require('../../lib/test-utils').findIndex;

describe('natural-order/decl-order', () => {
    it('should place block before its element', () => {
        const graph = new BemGraph();

        const decl = Array.from(graph.naturalDependenciesOf([
            { block: 'block', elem: 'elem' },
            { block: 'block' }
        ]));

        const indexBlock = findIndex(decl, { entity: { block: 'block' } });
        const indexElem = findIndex(decl, { entity: { block: 'block', elem: 'elem' } });

        expect(indexBlock < indexElem).to.be.true;
    });

    it('should place block before its boolean modifier', () => {
        const graph = new BemGraph();

        const decl = Array.from(graph.naturalDependenciesOf([
            { block: 'block', modName: 'mod', modVal: true },
            { block: 'block' }
        ]));

        const indexBlock = findIndex(decl, { entity: { block: 'block' } });
        const indexModifier = findIndex(decl, { entity: { block: 'block', modName: 'mod' } });

        expect(indexBlock < indexModifier).to.be.true;
    });

    it('should place block before its key-value modifier', () => {
        const graph = new BemGraph();

        const decl = Array.from(graph.naturalDependenciesOf([
            { block: 'block', modName: 'mod', modVal: 'val' },
            { block: 'block' }
        ]));

        const indexBlock = findIndex(decl, { entity: { block: 'block' } });
        const indexModifier = findIndex(decl, { entity: { block: 'block', modName: 'mod', modVal: 'val' } });

        expect(indexBlock < indexModifier).to.be.true;
    });

    it('should place block before its element with boolean modifier', () => {
        const graph = new BemGraph();

        const decl = Array.from(graph.naturalDependenciesOf([
            { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
            { block: 'block' }
        ]));

        const indexBlock = findIndex(decl, { entity: { block: 'block' } });
        const indexElem = findIndex(decl, { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true } });

        expect(indexBlock < indexElem).to.be.true;
    });

    it('should place block before its element with key-value modifier', () => {
        const graph = new BemGraph();

        const decl = Array.from(graph.naturalDependenciesOf([
            { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' },
            { block: 'block' }
        ]));

        const indexBlock = findIndex(decl, { entity: { block: 'block' } });
        const indexElem = findIndex(decl, { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } });

        expect(indexBlock < indexElem).to.be.true;
    });

    it('should place block\'s boolean modifier before block\' key-value modifier', () => {
        const graph = new BemGraph();

        const decl = Array.from(graph.naturalDependenciesOf([
            { block: 'block', modName: 'mod', modVal: 'val' },
            { block: 'block', modName: 'mod', modVal: true }
        ]));

        const indexBoolean = findIndex(decl, { entity: { block: 'block', modName: 'mod', modVal: true } });
        const indexKeyValue = findIndex(decl, { entity: { block: 'block', modName: 'mod', modVal: 'val' } });

        expect(indexBoolean < indexKeyValue).to.be.true;
    });

    it('should place elem before its boolean modifier', () => {
        const graph = new BemGraph();

        const decl = Array.from(graph.naturalDependenciesOf([
            { block: 'block', elem: 'elem', modName: 'mod', modVal: true },
            { block: 'block', elem: 'elem' }
        ]));

        const indexElem = findIndex(decl, { entity: { block: 'block', elem: 'elem' } });
        const indexModifier = findIndex(decl, { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true } });

        expect(indexElem < indexModifier).to.be.true;
    });

    it('should place elem before its key-value modifier', () => {
        const graph = new BemGraph();

        const decl = Array.from(graph.naturalDependenciesOf([
            { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' },
            { block: 'block', elem: 'elem' }
        ]));

        const indexElem = findIndex(decl, { entity: { block: 'block', elem: 'elem' } });
        const indexModifier = findIndex(decl, { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } });

        expect(indexElem < indexModifier).to.be.true;
    });

    it('should place elem\'s boolean modifier before elem\' key-value modifier', () => {
        const graph = new BemGraph();

        const decl = Array.from(graph.naturalDependenciesOf([
            { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' },
            { block: 'block', elem: 'elem', modName: 'mod', modVal: true }
        ]));

        const indexBoolean = findIndex(decl, { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: true } });
        const indexKeyValue = findIndex(decl, { entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' } });

        expect(indexBoolean < indexKeyValue).to.be.true;
    });
});
