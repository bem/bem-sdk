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
            .vertex({ block: 'A' })
            [linkMethod]({ block: 'B' });

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

        expect(decl).to.contain({ entity: { block: 'B' } });
    }
});

test('should resolve entity depending on multiple entities', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            [linkMethod]({ block: 'B' })
            [linkMethod]({ block: 'C' });

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf({ block: 'A' }));

        expect(decl).to.contain({ entity: { block: 'B' } })
            .and.to.contain({ entity: { block: 'C' } });
    }
});

test('should include entity to result once if multiple entities depend on this entity', macro, {
    graph: (linkMethod) => {
        const graph = new BemGraph();

        graph
            .vertex({ block: 'A' })
            [linkMethod]({ block: 'C' });

        graph
            .vertex({ block: 'B' })
            [linkMethod]({ block: 'C' });

        return graph;
    },
    test: (t, graph) => {
        const decl = Array.from(graph.dependenciesOf([{ block: 'A' }, { block: 'B' }]));

        const firstIndex = findIndex(decl, { entity: { block: 'C' } });
        const lastIndex = findLastIndex(decl, { entity: { block: 'C' } });

        expect(decl).to.contain({ entity: { block: 'C' } });
        expect(firstIndex).to.be.equal(lastIndex);
    }
});
