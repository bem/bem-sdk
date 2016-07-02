'use strict';

const test = require('ava');
const expect = require('chai').expect;

const BemGraph = lib.BemGraph;
const macro = utils.depsMacro;
const findIndex = utils.findIndex;
const findLastIndex = utils.findLastIndex;

test('should resolve entity depending on another entity', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' }, 'css')
            [linkMethod]({ block: 'B' }, 'css');

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

        expect(decl).to.contain({ entity: { block: 'B' }, tech: 'css' });
    }
});

test('should resolve entity depending by multiple techs on another entity', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' }, 'css')
            [linkMethod]({ block: 'B' }, 'css')
            [linkMethod]({ block: 'B' }, 'js');

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

        expect(decl).to.contain({ entity: { block: 'B' }, tech: 'css' });
    }
});

test('should resolve entity depending on multiple entities', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' }, 'css')
            [linkMethod]({ block: 'B' }, 'css')
            [linkMethod]({ block: 'C' }, 'css');

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

        expect(decl).to.contain({ entity: { block: 'B' }, tech: 'css' })
            .and.to.contain({ entity: { block: 'C' }, tech: 'css' });
    }
});

test('should include entity to result once if multiple entities depend on this entity', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' }, 'css')
            [linkMethod]({ block: 'C' }, 'css');

        graph
            .vertex({ block: 'B' }, 'css')
            [linkMethod]({ block: 'C' }, 'css');

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf([{ block: 'A' }, { block: 'B' }], 'css'));

        const firstIndex = findIndex(decl, { entity: { block: 'C' }, tech: 'css' });
        const lastIndex = findLastIndex(decl, { entity: { block: 'C' }, tech: 'css' });

        expect(decl).to.contain({ entity: { block: 'C' }, tech: 'css' });
        expect(firstIndex).to.be.equal(lastIndex);
    }
});
