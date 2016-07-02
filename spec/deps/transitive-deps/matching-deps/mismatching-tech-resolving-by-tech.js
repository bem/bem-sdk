'use strict';

const test = require('ava');
const expect = require('chai').expect;

const BemGraph = lib.BemGraph;
const macro = utils.depsMacro;
const findIndex = utils.findIndex;
const findLastIndex = utils.findLastIndex;

test('should not resolve transitive dependency', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' }, 'css')
            [linkMethod]({ block: 'B' }, 'js');

        graph
            .vertex({ block: 'B' }, 'css')
            [linkMethod]({ block: 'C' }, 'js');

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

        expect(decl).to.not.contain({ entity: { block: 'C' }, tech: 'js' });
    }
});

test('should not resolve transitive entity depending on multiple dependencies', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' }, 'css')
            [linkMethod]({ block: 'B' }, 'js');

        graph
            .vertex({ block: 'B' }, 'css')
            [linkMethod]({ block: 'C' }, 'js')
            [linkMethod]({ block: 'D' }, 'js');

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

        expect(decl).to.not.contain({ entity: { block: 'C' }, tech: 'js' })
            .and.to.not.contain({ entity: { block: 'D' }, tech: 'js' });
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

        expect(decl).to.contain({ entity: { block: 'C' }, tech: 'js' });
    }
});

test('should resolve multiple tech dependencies depending on another tech different from resolving' +
    ' tech', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            [linkMethod]({ block: 'B' }, 'css')
            [linkMethod]({ block: 'C' }, 'css');

        graph
            .vertex({ block: 'B' })
            [linkMethod]({ block: 'D' }, 'js');

        graph
            .vertex({ block: 'C' })
            [linkMethod]({ block: 'D' }, 'js');

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf({ block: 'A' }, 'css'));

        const firstIndex = findIndex(decl, { entity: { block: 'D' }, tech: 'js' });
        const lastIndex = findLastIndex(decl, { entity: { block: 'D' }, tech: 'js' });

        expect(decl).to.contain({ entity: { block: 'D' }, tech: 'js' });
        expect(firstIndex).to.be.equal(lastIndex);
    }
});
