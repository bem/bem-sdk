'use strict';

const test = require('ava');
const expect = require('chai').expect;

const BemGraph = lib.BemGraph;
const macro = utils.depsMacro;

test('should resolve transitive dependency', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' }, 'css')
            [linkMethod]({ block: 'B' }, 'css');

        graph
            .vertex({ block: 'B' }, 'css')
            [linkMethod]({ block: 'C' }, 'css');

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

        expect(decl).to.contain({ entity: { block: 'C' }, tech: 'css' });
    }
});

test('should resolve transitive entity depending on multiple dependencies', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' }, 'css')
            [linkMethod]({ block: 'B' }, 'css');

        graph
            .vertex({ block: 'B' }, 'css')
            [linkMethod]({ block: 'C' }, 'css')
            [linkMethod]({ block: 'D' }, 'css');

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

        expect(decl).to.contain({ entity: { block: 'C' }, tech: 'css' })
            .and.to.contain({ entity: { block: 'D' }, tech: 'css' });
    }
});

test('should resolve transitive depending by multiple techs on another entity', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' }, 'css')
            [linkMethod]({ block: 'B' });

        graph
            .vertex({ block: 'B' }, 'css')
            [linkMethod]({ block: 'C' }, 'css')
            [linkMethod]({ block: 'C' }, 'js');

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

        expect(decl).to.contain({ entity: { block: 'C' }, tech: 'css' });
    }
});
