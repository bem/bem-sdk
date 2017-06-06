'use strict';

const test = require('ava');
const expect = require('chai').expect;

const BemGraph = lib.BemGraph;
const macro = utils.depsMacro;

test('should resolve transitive dependency', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            [linkMethod]({ block: 'B' });

        graph
            .vertex({ block: 'B' })
            [linkMethod]({ block: 'C' });

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

        expect(decl).to.contain({ entity: { block: 'C' } });
    }
});

test('should resolve transitive entity depending on multiple dependencies', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            [linkMethod]({ block: 'B' });

        graph
            .vertex({ block: 'B' })
            [linkMethod]({ block: 'C' })
            [linkMethod]({ block: 'D' });

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

        expect(decl).to.contain({ entity: { block: 'C' } })
            .and.to.contain({ entity: { block: 'D' } });
    }
});
