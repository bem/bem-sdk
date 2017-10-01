'use strict';

const describe = require('mocha').describe;
const it = require('mocha').it;

const expect = require('chai').expect;

const BemGraph = require('../../lib').BemGraph;
const findIndex = require('../../lib/test-utils').findIndex;

describe('ordering-priority/ordered-vs-bem', () => {
    it('should prioritise ordered dependency over block-element natural ordering', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .dependsOn({ block: 'A', elem: 'e' });

        graph.naturalize();

        const decl = graph.dependenciesOf({ block: 'A' });
        const indexBlock = findIndex(decl, { entity: { block: 'A' } });
        const indexElement = findIndex(decl, { entity: { block: 'A', elem: 'e' } });

        expect(indexElement < indexBlock).to.be.true;
    });

    it('should prioritise ordered dependency over block - boolean modifier natural ordering', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .dependsOn({ block: 'A', modName: 'm', modVal: true });

        graph.naturalize();

        const decl = graph.dependenciesOf([{ block: 'A' }, { block: 'A', modName: 'm', modVal: true }]);
        const indexBlock = findIndex(decl, { entity: { block: 'A' } });
        const indexModifier = findIndex(decl, { entity: { block: 'A', modName: 'm', modVal: true } });

        expect(indexModifier < indexBlock).to.be.true;
    });

    it('should prioritise ordered dependency over block - key-value modifier natural ordering', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            .dependsOn({ block: 'A', modName: 'm', modVal: 'val' });

        graph.naturalize();

        const decl = graph.dependenciesOf([{ block: 'A' }, { block: 'A', modName: 'm', modVal: 'val' }]);
        const indexBlock = findIndex(decl, { entity: { block: 'A' } });
        const indexModifier = findIndex(decl, { entity: { block: 'A', modName: 'm', modVal: 'val' } });

        expect(indexModifier < indexBlock).to.be.true;
    });

    it('should prioritise ordered dependency over element - element boolean modifier natural ordering', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A', elem: 'e' })
            .dependsOn({ block: 'A', elem: 'e', modName: 'm', modVal: true });

        graph.naturalize();

        const decl = graph.dependenciesOf([
            { block: 'A', elem: 'e' },
            { block: 'A', elem: 'e', modName: 'm', modVal: true }
        ]);
        const indexElement = findIndex(decl, { entity: { block: 'A', elem: 'e' } });
        const indexModifier = findIndex(decl, { entity: { block: 'A', elem: 'e', modName: 'm', modVal: true } });

        expect(indexModifier < indexElement).to.be.true;
    });

    it('should prioritise ordered dependency over element - element key-value modifier natural ordering', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A', elem: 'e' })
            .dependsOn({ block: 'A', elem: 'e', modName: 'm', modVal: 'val' });

        graph.naturalize();

        const decl = graph.dependenciesOf([
            { block: 'A', elem: 'e' },
            { block: 'A', elem: 'e', modName: 'm', modVal: 'val' }
        ]);
        const indexElement = findIndex(decl, { entity: { block: 'A', elem: 'e' } });
        const indexModifier = findIndex(decl, { entity: { block: 'A', elem: 'e', modName: 'm', modVal: 'val' } });

        expect(indexModifier < indexElement).to.be.true;
    });

    it('should prioritise ordered dependency over boolean modifier - key-value modifier natural ordering', () => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A', modName: 'm', modVal: true })
            .dependsOn({ block: 'A', modName: 'm', modVal: 'val' });

        graph.naturalize();

        const decl = graph.dependenciesOf([
            { block: 'A', modName: 'm', modVal: true },
            { block: 'A', modName: 'm', modVal: 'val' }
        ]);
        const indexBoolean = findIndex(decl, { entity: { block: 'A', modName: 'm', modVal: true } });
        const indexKeyValue = findIndex(decl, { entity: { block: 'A', modName: 'm', modVal: 'val' } });

        expect(indexKeyValue < indexBoolean).to.be.true;
    });
});
